import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { TypeCompte } from "../entity/TypeCompte";




export const createTypeCompte = async (req: Request, res: Response) => {
    const typeCompte = myDataSource.getRepository(TypeCompte).create(req.body);
    const errors = await validate(typeCompte)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeCompte).save(typeCompte)
    .then(typeCompte => {
        const message = `Le type de compte ${req.body.id} a bien été créée.`
        return success(res,201, typeCompte,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de compte  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de compte  existe déjà.')
        }
        const message = `Le type de compte n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTypeCompte = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeCompte).find({
        relations:{
            comptes:true


        }
    })
    .then((retour) => {
        const message = 'La liste des types de comptes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des types de comptes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTypeCompte = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeCompte).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            comptes:true,

    },
    })
    .then(typeCompte => {
        if(typeCompte === null) {
          const message = `Le type de compte demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le type de compte a bien été trouvée.`
        return success(res,200, typeCompte,message);
    })
    .catch(error => {
        const message = `Le type de compte n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTypeCompte = async (req: Request, res: Response) => {
    const typeCompte = await myDataSource.getRepository(TypeCompte).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            comptes:true,
    

     },
    }
    )
    if (!typeCompte) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce type de compte  existe déjà')
    }
    myDataSource.getRepository(TypeCompte).merge(typeCompte,req.body);
    const errors = await validate(typeCompte);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeCompte).save(typeCompte).then(typeCompte => {
        const message = `Le type de compte ${typeCompte.id} a bien été modifiée.`
        return success(res,200,typeCompte,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de compte existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de compte existe déjà')
        }
        const message = `Le type de compte n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTypeCompte = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('TypeCompte', parseInt(req.params.id));
    await myDataSource.getRepository(TypeCompte)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            comptes:true
            
   }
        })
    .then(typeCompte => {        
        if(typeCompte === null) {
          const message = `Le type de compte demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce type de compte est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce type de compte est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(TypeCompte).softRemove(typeCompte)
            .then(_ => {
                const message = `Le type de compte avec l'identifiant n°${typeCompte.id} a bien été supprimée.`;
                return success(res,200, typeCompte,message);
            })
        }
    }).catch(error => {
        const message = `Le type de compte n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
