import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { Transaction } from "../entity/Transaction";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";




export const createTransaction = async (req: Request, res: Response) => {
    const transaction = myDataSource.getRepository(Transaction).create(req.body);
    const errors = await validate(transaction)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Transaction).save(transaction)
    .then(transaction => {
        const message = `La transaction ${req.body.id} a bien été créée.`
        return success(res,201, transaction,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette transaction  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette transaction  existe déjà.')
        }
        const message = `La transaction n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTransaction = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Transaction).find({
        relations:{
            client:true,
            typeoperation:true,
            banque:true,
            compte:true

        }
    })
    .then((retour) => {
        const message = 'La liste des transactions a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des transactions n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTransaction = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Transaction).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            client:true,
            typeoperation:true,
            banque:true,
            compte:true
  },
    })
    .then(transaction => {
        if(transaction === null) {
          const message = `La transaction demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La transaction a bien été trouvée.`
        return success(res,200, transaction,message);
    })
    .catch(error => {
        const message = `La transaction n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTransaction = async (req: Request, res: Response) => {
    const transaction = await myDataSource.getRepository(Transaction).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            client:true,
            typeoperation:true,
            banque:true,
            compte:true
 
        },
    }
    )
    if (!transaction) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette transaction  existe déjà')
    }
    myDataSource.getRepository(Transaction).merge(transaction,req.body);
    const errors = await validate(transaction);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Transaction).save(transaction).then(transaction => {
        const message = `La transaction ${transaction.id} a bien été modifié.`
        return success(res,200,transaction,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette transaction existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette transaction existe déjà')
        }
        const message = `La transaction n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTransaction = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Transcation', parseInt(req.params.id));
    await myDataSource.getRepository(Transaction)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            client:true,
            typeoperation:true,
            banque:true,
            compte:true
 
        }
        })
    .then(transaction => {        
        if(transaction === null) {
          const message = `La transaction demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette transaction est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette transaction est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Transaction).softRemove(transaction)
            .then(_ => {
                const message = `La transaction avec l'identifiant n°${transaction.id} a bien été supprimée.`;
                return success(res,200, transaction,message);
            })
        }
    }).catch(error => {
        const message = `La transaction n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
