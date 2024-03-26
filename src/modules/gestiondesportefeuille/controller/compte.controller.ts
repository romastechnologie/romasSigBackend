import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { Compte } from "../entity/Compte";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";



export const createCompte = async (req: Request, res: Response) => {
    const compte = myDataSource.getRepository(Compte).create(req.body);
    const errors = await validate(compte)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Compte).save(compte)
    .then(compte => {
        const message = `Le compte ${req.body.id} a bien été créé.`
        return success(res,201, compte,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce compte  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce compte  existe déjà.')
        }
        const message = `Le compte n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllCompte = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Compte).find({
        relations:{
            client:true,
            fournisseur:true,
            comptetransacs:true
        }
    })
    .then((retour) => {
        const message = 'La liste des comptes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des comptes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getCompte = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Compte).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            client:true,
            fournisseur:true,
            comptetransacs:true 
        },
    })
    .then(compte => {
        if(compte === null) {
          const message = `Le compte demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le compte a bien été trouvée.`
        return success(res,200, compte,message);
    })
    .catch(error => {
        const message = `Le compte n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateCompte = async (req: Request, res: Response) => {
    const compte = await myDataSource.getRepository(Compte).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            client:true,
            fournisseur:true,
            comptetransacs:true 
        },
    }
    )
    if (!compte) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce compte  existe déjà')
    }
    myDataSource.getRepository(Compte).merge(compte,req.body);
    const errors = await validate(compte);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Compte).save(compte).then(compte => {
        const message = `Le compte ${compte.id} a bien été modifié.`
        return success(res,200,compte,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce compte existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce compte existe déjà')
        }
        const message = `Le compte n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteCompte = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Compte', parseInt(req.params.id));
    await myDataSource.getRepository(Compte)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            client:true,
            fournisseur:true,
            comptetransacs:true
        }
        })
    .then(compte => {        
        if(compte === null) {
          const message = `Le compte demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce compte est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce compte est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Compte).softRemove(compte)
            .then(_ => {
                const message = `Le compte avec l'identifiant n°${compte.id} a bien été supprimée.`;
                return success(res,200, compte,message);
            })
        }
    }).catch(error => {
        const message = `Le compte n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
