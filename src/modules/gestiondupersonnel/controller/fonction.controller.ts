import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Fonction } from "../entity/Fonction";




export const createFonction = async (req: Request, res: Response) => {
    const fonction = myDataSource.getRepository(Fonction).create(req.body);
    const errors = await validate(fonction)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Fonction).save(fonction)
    .then(fonction => {
        const message = `La fonction ${req.body.id} a bien été créée.`
        return success(res,201, fonction,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette fonction  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette fonction  existe déjà.')
        }
        const message = `La fonction n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllFonction = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Fonction).find({
        relations:{
            personnelfonctions:true, 
        }
    })
    .then((retour) => {
        const message = 'La liste des fonctions a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des fonctions n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getFonction = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Fonction).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            personnelfonctions:true,  
    },
    })
    .then(fonction => {
        if(fonction === null) {
          const message = `La fonction demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La fonction a bien été trouvée.`
        return success(res,200, fonction,message);
    })
    .catch(error => {
        const message = `La fonction n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateFonction = async (req: Request, res: Response) => {
    const fonction = await myDataSource.getRepository(Fonction).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            personnelfonctions:true,            
            
        },
    }
    )
    if (!fonction) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette fonction  existe déjà')
    }
    myDataSource.getRepository(Fonction).merge(fonction,req.body);
    const errors = await validate(fonction);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Fonction).save(fonction).then(fonction => {
        const message = `La fonction ${fonction.id} a bien été modifié.`
        return success(res,200,fonction,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette fonction existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette fonction existe déjà')
        }
        const message = `La fonction n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteFonction = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Fonction', parseInt(req.params.id));
    await myDataSource.getRepository(Fonction)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            personnelfonctions:true,
            
        }
        })
    .then(fonction => {        
        if(fonction === null) {
          const message = `La fonction demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette fonction est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette fonction est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Fonction).softRemove(fonction)
            .then(_ => {
                const message = `La fonction avec l'identifiant n°${fonction.id} a bien été supprimée.`;
                return success(res,200, fonction,message);
            })
        }
    }).catch(error => {
        const message = `La fonction n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
