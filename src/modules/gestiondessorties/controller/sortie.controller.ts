import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { Sortie } from "../entity/Sortie";




export const createSortie = async (req: Request, res: Response) => {
    const sortie = myDataSource.getRepository(Sortie).create(req.body);
    const errors = await validate(sortie)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Sortie).save(sortie)
    .then(sortie => {
        const message = `La sortie ${req.body.id} a bien été créé.`
        return success(res,201, sortie,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette sortie existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette sortie existe déjà.')
        }
        const message = `La sortie n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllSortie = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Sortie).find({
        relations:{
            sortiprocondis:true
        }
    })
    .then((retour) => {
        const message = 'La liste des sorties a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des sorties n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getSortie = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Sortie).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            sortiprocondis:true
    },
    })
    .then(sortie => {
        if(sortie === null) {
          const message = `La sortie demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La sortie a bien été trouvée.`
        return success(res,200, sortie,message);
    })
    .catch(error => {
        const message = `La sortie n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateSortie = async (req: Request, res: Response) => {
    const sortie = await myDataSource.getRepository(Sortie).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            sortiprocondis:true
            
        },
    }
    )
    if (!sortie) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette sortie existe déjà')
    }
    myDataSource.getRepository(Sortie).merge(sortie,req.body);
    const errors = await validate(sortie);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Sortie).save(sortie).then(sortie => {
        const message = `La sortie ${sortie.id} a bien été modifiée.`
        return success(res,200,sortie,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette sortie existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette sortie existe déjà')
        }
        const message = `La sortie n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteSortie = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Sortie', parseInt(req.params.id));
    await myDataSource.getRepository(Sortie)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            sortiprocondis:true 
        }
        })
    .then(sortie => {        
        if(sortie === null) {
          const message = `La sortie demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette sortie est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette sortie est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Sortie).softRemove(sortie)
            .then(_ => {
                const message = `La sortie avec l'identifiant n°${sortie.id} a bien été supprimée.`;
                return success(res,200, sortie,message);
            })
        }
    }).catch(error => {
        const message = `La sortie n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
