import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Paiement } from "../entity/Paiement";



export const createPaiement = async (req: Request, res: Response) => {
    const paiement = myDataSource.getRepository(Paiement).create(req.body);
    const errors = await validate(paiement)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Paiement).save(paiement)
    .then(paiement => {
        const message = `Le paiement ${req.body.id} a bien été créée.`
        return success(res,201, paiement,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce paiement  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce paiement  existe déjà.')
        }
        const message = `Le paiement n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllPaiement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Paiement).find({
        relations:{
            modepaiement:true,
            facture:true,
            transfert:true
        }
    })
    .then((retour) => {
        const message = 'La liste des paiements a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des paiements n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getPaiement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Paiement).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            modepaiement:true,
            facture:true,
            transfert:true
    },
    })
    .then(paiement => {
        if(paiement === null) {
          const message = `Le paiement demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le paiement a bien été trouvée.`
        return success(res,200, paiement,message);
    })
    .catch(error => {
        const message = `Le paiement n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updatePaiement = async (req: Request, res: Response) => {
    const paiement = await myDataSource.getRepository(Paiement).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            modepaiement:true,
            facture:true,
            transfert:true
     },
    }
    )
    if (!paiement) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce paiement  existe déjà')
    }
    myDataSource.getRepository(Paiement).merge(paiement,req.body);
    const errors = await validate(paiement);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Paiement).save(paiement).then(paiement => {
        const message = `Le paiement ${paiement.id} a bien été modifiée.`
        return success(res,200,paiement,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce paiement existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce paiement existe déjà')
        }
        const message = `Le paiement n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deletePaiement = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Paiement', parseInt(req.params.id));
    await myDataSource.getRepository(Paiement)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            modepaiement:true,
            facture:true,
            transfert:true
   }
        })
    .then(paiement => {        
        if(paiement === null) {
          const message = `Le paiement demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce paiement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce paiement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Paiement).softRemove(paiement)
            .then(_ => {
                const message = `Le paiement avec l'identifiant n°${paiement.id} a bien été supprimée.`;
                return success(res,200, paiement,message);
            })
        }
    }).catch(error => {
        const message = `Le paiement n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
