import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { Fournisseur } from "../entity/Fournisseur";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";




export const createFournisseur = async (req: Request, res: Response) => {
    const fournisseur = myDataSource.getRepository(Fournisseur).create(req.body);
    const errors = await validate(fournisseur)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Fournisseur).save(fournisseur)
    .then(fournisseur => {
        const message = `Le fournisseur ${req.body.id} a bien été créé.`
        return success(res,201, fournisseur,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce fournisseur  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce fournisseur  existe déjà.')
        }
        const message = `Le fournisseur n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllFournisseur = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Fournisseur).find({
        relations:{
            fournisseurdemandprix:true,
            fournisseurcommandes: true
        }
    })
    .then((retour) => {
        const message = 'La liste des fournisseurs a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des fournisseurs n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getFournisseur = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Fournisseur).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            fournisseurdemandprix:true,
            fournisseurcommandes: true
    },
    })
    .then(fournisseur => {
        if(fournisseur === null) {
          const message = `Le fournisseur demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le fournisseur a bien été trouvée.`
        return success(res,200, fournisseur,message);
    })
    .catch(error => {
        const message = `Le fournisseur n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateFournisseur = async (req: Request, res: Response) => {
    const fournisseur = await myDataSource.getRepository(Fournisseur).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
           
            fournisseurdemandprix:true,
            fournisseurcommandes: true
        },
    }
    )
    if (!fournisseur) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce fournisseur  existe déjà')
    }
    myDataSource.getRepository(Fournisseur).merge(fournisseur,req.body);
    const errors = await validate(fournisseur);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Fournisseur).save(fournisseur).then(fournisseur => {
        const message = `Le fournisseur ${fournisseur.id} a bien été modifié.`
        return success(res,200,fournisseur,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce fournisseur existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce fournisseur existe déjà')
        }
        const message = `Le fournisseur n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteFournisseur = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Fournisseur', parseInt(req.params.id));
    await myDataSource.getRepository(Fournisseur)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            fournisseurdemandprix:true,
            fournisseurcommandes: true
           
        }
        })
    .then(fournisseur => {        
        if(fournisseur === null) {
          const message = `Le fournisseur demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce fournisseur est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce fournisseur est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Fournisseur).softRemove(fournisseur)
            .then(_ => {
                const message = `Le fournisseur avec l'identifiant n°${fournisseur.id} a bien été supprimé.`;
                return success(res,200, fournisseur,message);
            })
        }
    }).catch(error => {
        const message = `Le fournisseur n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
