import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { TypeOperation } from "../entity/TypeOperation";


export const createTypeOperation= async (req: Request, res: Response) => {
    const typeOperation = myDataSource.getRepository(TypeOperation).create(req.body);
    const errors = await validate(typeOperation)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeOperation).save(typeOperation)
    .then(typeOperation => {
        const message = `Le type de taxe${req.body.id} a bien été créé.`
        return success(res,201, typeOperation,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de taxe existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de taxe  existe déjà.')
        }
        const message = `Le type de taxe n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTypeOperation = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeOperation).find({
    })
    .then((retour) => {
        const message = 'La liste des typeOperations a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des typeOperations n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTypeOperation = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeOperation).findOne({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(typeOperation => {
        if(typeOperation === null) {
          const message = `Le type de taxedemandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le type de taxea bien été trouvée.`
        return success(res,200, typeOperation,message);
    })
    .catch(error => {
        const message = `Le type de taxe n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTypeOperation = async (req: Request, res: Response) => {
    const typeOperation = await myDataSource.getRepository(TypeOperation).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        }
    }
    )
    if (!typeOperation) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce type de taxe existe déjà')
    }
    myDataSource.getRepository(TypeOperation).merge(typeOperation,req.body);
    const errors = await validate(typeOperation);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeOperation).save(typeOperation).then(typeOperation => {
        const message = `Le type de taxe${typeOperation.id} a bien été modifié.`
        return success(res,200,typeOperation,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de taxe existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de taxe existe déjà')
        }
        const message = `Le type de taxe n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTypeOperation = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('TypeOperation', parseInt(req.params.id));
    await myDataSource.getRepository(TypeOperation)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        }
        })
    .then(typeOperation => {        
        if(typeOperation === null) {
          const message = `Le type de taxedemandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce type de taxe est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce type de taxeest lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(TypeOperation).softRemove(typeOperation)
            .then(_ => {
                const message = `Le type de taxe avec l'identifiant n°${typeOperation.id} a bien été supprimée.`;
                return success(res,200, typeOperation,message);
            })
        }
    }).catch(error => {
        const message = `Le type de taxe n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
