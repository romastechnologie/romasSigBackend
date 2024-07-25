import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { TypeDepense } from "../entity/TypeDepense";


export const createTypeDepense= async (req: Request, res: Response) => {
    const typeDepense = myDataSource.getRepository(TypeDepense).create(req.body);
    const errors = await validate(typeDepense)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeDepense).save(typeDepense)
    .then(typeDepense => {
        const message = `Le type de depense${req.body.id} a bien été créé.`
        return success(res,201, typeDepense,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de depense existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de depense  existe déjà.')
        }
        const message = `Le type de depense n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTypeDepense = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeDepense).find({
    })
    .then((retour) => {
        const message = 'La liste des typeDepenses a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des typeDepenses n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTypeDepense = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeDepense).findOne({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(typeDepense => {
        if(typeDepense === null) {
          const message = `Le type de depensedemandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le type de depensea bien été trouvée.`
        return success(res,200, typeDepense,message);
    })
    .catch(error => {
        const message = `Le type de depense n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTypeDepense = async (req: Request, res: Response) => {
    const typeDepense = await myDataSource.getRepository(TypeDepense).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        }
    }
    )
    if (!typeDepense) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce type de depense existe déjà')
    }
    myDataSource.getRepository(TypeDepense).merge(typeDepense,req.body);
    const errors = await validate(typeDepense);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeDepense).save(typeDepense).then(typeDepense => {
        const message = `Le type de depense${typeDepense.id} a bien été modifié.`
        return success(res,200,typeDepense,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de depense existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de depense existe déjà')
        }
        const message = `Le type de depense n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTypeDepense = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('TypeDepense', parseInt(req.params.id));
    await myDataSource.getRepository(TypeDepense)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        }
        })
    .then(typeDepense => {        
        if(typeDepense === null) {
          const message = `Le type de depensedemandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce type de depense est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce type de depenseest lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(TypeDepense).softRemove(typeDepense)
            .then(_ => {
                const message = `Le type de depense avec l'identifiant n°${typeDepense.id} a bien été supprimée.`;
                return success(res,200, typeDepense,message);
            })
        }
    }).catch(error => {
        const message = `Le type de depense n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
