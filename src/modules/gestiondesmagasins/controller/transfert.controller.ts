import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { Transfert } from "../entity/Transfert";




export const createTransfert = async (req: Request, res: Response) => {
    const transfert = myDataSource.getRepository(Transfert).create(req.body);
    const errors = await validate(transfert)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Transfert).save(transfert)
    .then(transfert => {
        const message = `Le transfert ${req.body.id} a bien été créé.`
        return success(res,201, transfert,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce transfert  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce transfert  existe déjà.')
        }
        const message = `Le transfert n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTransfert = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Transfert).find({
        relations:{
            magasin1:true,
            magasin2:true,
            transfertprocondis: true,
            transfpaiements:true
           
        }
    })
    .then((retour) => {
        const message = 'La liste des transferts a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des transferts n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTransfert = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Transfert).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            magasin1:true,
            magasin2:true,
            transfertprocondis: true,
            transfpaiements:true
            },
    })
    .then(transfert => {
        if(transfert === null) {
          const message = `Le transfert demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le transfert a bien été trouvée.`
        return success(res,200, transfert,message);
    })
    .catch(error => {
        const message = `Le transfert n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTransfert = async (req: Request, res: Response) => {
    const transfert = await myDataSource.getRepository(Transfert).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            magasin1:true,
            magasin2:true,
            transfertprocondis: true,
            transfpaiements:true
           
        },
    }
    )
    if (!transfert) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce transfert  existe déjà')
    }
    myDataSource.getRepository(Transfert).merge(transfert,req.body);
    const errors = await validate(transfert);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Transfert).save(transfert).then(transfert => {
        const message = `Le transfert ${transfert.id} a bien été modifié.`
        return success(res,200,transfert,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce transfert existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce transfert existe déjà')
        }
        const message = `Le transfert n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTransfert = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Transfert', parseInt(req.params.id));
    await myDataSource.getRepository(Transfert)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            magasin1:true,
            magasin2:true,
            transfertprocondis: true,
            transfpaiements:true
           
        }
        })
    .then(transfert => {        
        if(transfert === null) {
          const message = `Le transfert demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce transfert est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce transfert est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Transfert).softRemove(transfert)
            .then(_ => {
                const message = `Le transfert avec l'identifiant n°${transfert.id} a bien été supprimée.`;
                return success(res,200, transfert,message);
            })
        }
    }).catch(error => {
        const message = `Le transfert n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
