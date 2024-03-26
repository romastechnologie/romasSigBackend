import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Personnel } from "../entity/Personnel";




export const createPersonnel = async (req: Request, res: Response) => {
    const personnel = myDataSource.getRepository(Personnel).create(req.body);
    const errors = await validate(personnel)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Personnel).save(personnel)
    .then(personnel => {
        const message = `Le personnel ${req.body.id} a bien été créée.`
        return success(res,201, personnel,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce personnel  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce personnel  existe déjà.')
        }
        const message = `Le personnel n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllPersonnel = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Personnel).find({
        relations:{
            personnelfonctions:true, 
        }
    })
    .then((retour) => {
        const message = 'La liste des personnels a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des personnels n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getPersonnel = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Personnel).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            personnelfonctions:true,  
    },
    })
    .then(personnel => {
        if(personnel === null) {
          const message = `Le personnel demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le personnel a bien été trouvée.`
        return success(res,200, personnel,message);
    })
    .catch(error => {
        const message = `Le personnel n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updatePersonnel = async (req: Request, res: Response) => {
    const personnel = await myDataSource.getRepository(Personnel).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            personnelfonctions:true,            
            
        },
    }
    )
    if (!personnel) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce personnel  existe déjà')
    }
    myDataSource.getRepository(Personnel).merge(personnel,req.body);
    const errors = await validate(personnel);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Personnel).save(personnel).then(personnel => {
        const message = `Le personnel ${personnel.id} a bien été modifié.`
        return success(res,200,personnel,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce personnel existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce personnel existe déjà')
        }
        const message = `Le personnel n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deletePersonnel = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('personnel', parseInt(req.params.id));
    await myDataSource.getRepository(Personnel)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            personnelfonctions:true,
            
        }
        })
    .then(personnel => {        
        if(personnel === null) {
          const message = `Le personnel demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce personnel est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce personnel est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Personnel).softRemove(personnel)
            .then(_ => {
                const message = `Le personnel avec l'identifiant n°${personnel.id} a bien été supprimée.`;
                return success(res,200, personnel,message);
            })
        }
    }).catch(error => {
        const message = `Le personnel n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
