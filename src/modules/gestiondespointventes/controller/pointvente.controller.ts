import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { PointVente } from "../entity/PointVente";





export const createPointVente = async (req: Request, res: Response) => {
    const pointVente = myDataSource.getRepository(PointVente).create(req.body);
    const errors = await validate(pointVente)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(PointVente).save(pointVente)
    .then(pointVente => {
        const message = `Le point de vente ${req.body.id} a bien été créé.`
        return success(res,201, pointVente,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce point de vente  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce point de vente  existe déjà.')
        }
        const message = `Le point de vente n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllPointVente = async (req: Request, res: Response) => {
    await myDataSource.getRepository(PointVente).find({
        relations:{
            societe:true,
            personnel:true
        }
    })
    .then((retour) => {
        const message = 'La liste des pointVentes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des pointVentes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getPointVente = async (req: Request, res: Response) => {
    await myDataSource.getRepository(PointVente).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            societe:true,
            personnel:true
    },
    })
    .then(pointVente => {
        if(pointVente === null) {
          const message = `Le point de vente demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le point de vente a bien été trouvée.`
        return success(res,200, pointVente,message);
    })
    .catch(error => {
        const message = `Le point de vente n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updatePointVente = async (req: Request, res: Response) => {
    const pointVente = await myDataSource.getRepository(PointVente).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            societe:true,
            personnel:true
        },
    }
    )
    if (!pointVente) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce point de vente  existe déjà')
    }
    myDataSource.getRepository(PointVente).merge(pointVente,req.body);
    const errors = await validate(pointVente);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(PointVente).save(pointVente).then(pointVente => {
        const message = `Le point de vente ${pointVente.id} a bien été modifié.`
        return success(res,200,pointVente,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce point de vente existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce point de vente existe déjà')
        }
        const message = `Le point de vente n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deletePointVente = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('PointVente', parseInt(req.params.id));
    await myDataSource.getRepository(PointVente)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            societe:true,
            personnel:true
        }
        })
    .then(pointVente => {        
        if(pointVente === null) {
          const message = `Le point de vente demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce point de vente est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce point de vente est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(PointVente).softRemove(pointVente)
            .then(_ => {
                const message = `Le point de vente avec l'identifiant n°${pointVente.id} a bien été supprimée.`;
                return success(res,200, pointVente,message);
            })
        }
    }).catch(error => {
        const message = `Le point de vente n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
