import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";

import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Vente } from "../entity/Vente";


export const createVente = async (req: Request, res: Response) => {
    const vente = myDataSource.getRepository(Vente).create(req.body);
    const errors = await validate(vente)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Vente).save(vente)
    .then(vente => {
        const message = `La vente ${req.body.id} a bien été créé.`
        return success(res,201, vente,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette vente  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette vente  existe déjà.')
        }
        const message = `La vente n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllVente = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Vente).find({
        relations:{
            clients:true
        }
    })
    .then((retour) => {
        const message = 'La liste des ventes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des ventes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getVente = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Vente).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            clients:true
    },
    })
    .then(vente => {
        if(vente === null) {
          const message = `La vente demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La vente a bien été trouvée.`
        return success(res,200, vente,message);
    })
    .catch(error => {
        const message = `La vente n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateVente = async (req: Request, res: Response) => {
    const vente = await myDataSource.getRepository(Vente).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            clients:true
        },
    }
    )
    if (!vente) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette vente  existe déjà')
    }
    myDataSource.getRepository(Vente).merge(vente,req.body);
    const errors = await validate(vente);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Vente).save(vente).then(vente => {
        const message = `La vente ${vente.id} a bien été modifié.`
        return success(res,200,vente,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette vente existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette vente existe déjà')
        }
        const message = `La vente n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteVente = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Vente', parseInt(req.params.id));
    await myDataSource.getRepository(Vente)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            clients:true
        }
        })
    .then(vente => {        
        if(vente === null) {
          const message = `La vente demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette vente est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette vente est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Vente).softRemove(vente)
            .then(_ => {
                const message = `La vente avec l'identifiant n°${vente.id} a bien été supprimée.`;
                return success(res,200, vente,message);
            })
        }
    }).catch(error => {
        const message = `La vente n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
