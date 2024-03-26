import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { Societe } from "../entity/Societe";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";




export const createSociete = async (req: Request, res: Response) => {
    const societe = myDataSource.getRepository(Societe).create(req.body);
    const errors = await validate(societe)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Societe).save(societe)
    .then(societe => {
        const message = `La société ${req.body.id} a bien été créé.`
        return success(res,201, societe,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette société  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette société  existe déjà.')
        }
        const message = `La société n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllSociete = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Societe).find({
        relations:{
            banquesocietes:true,
            societepointvents:true

        }
    })
    .then((retour) => {
        const message = 'La liste des societes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des societes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getSociete = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Societe).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            banquesocietes:true,
            societepointvents:true

    },
    })
    .then(societe => {
        if(societe === null) {
          const message = `La société demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La société a bien été trouvée.`
        return success(res,200, societe,message);
    })
    .catch(error => {
        const message = `La société n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateSociete = async (req: Request, res: Response) => {
    const societe = await myDataSource.getRepository(Societe).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            banquesocietes:true,
            societepointvents:true

        },
    }
    )
    if (!societe) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette société  existe déjà')
    }
    myDataSource.getRepository(Societe).merge(societe,req.body);
    const errors = await validate(societe);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Societe).save(societe).then(societe => {
        const message = `La société ${societe.id} a bien été modifié.`
        return success(res,200,societe,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette société existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette société existe déjà')
        }
        const message = `La société n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteSociete = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Societe', parseInt(req.params.id));
    await myDataSource.getRepository(Societe)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            banquesocietes:true,
            societepointvents:true

           
        }
        })
    .then(societe => {        
        if(societe === null) {
          const message = `La société demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette société est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette société est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Societe).softRemove(societe)
            .then(_ => {
                const message = `La société avec l'identifiant n°${societe.id} a bien été supprimée.`;
                return success(res,200, societe,message);
            })
        }
    }).catch(error => {
        const message = `La société n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
