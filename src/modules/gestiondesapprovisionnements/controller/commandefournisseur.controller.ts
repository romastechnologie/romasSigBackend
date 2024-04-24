import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { CommandeFournisseur } from "../entity/CommandeFournisseur";

export const createCommandeFournisseur = async (req: Request, res: Response) => {
    const commandeFournisseur = myDataSource.getRepository(CommandeFournisseur).create(req.body);
    const errors = await validate(commandeFournisseur)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(CommandeFournisseur).save(commandeFournisseur)
    .then(commandeFournisseur => {
        const message = `La commande du fournisseur${req.body.id} a bien été créé.`
        return success(res,201, commandeFournisseur,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette commande du Fournisseur  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette commande du Fournisseur  existe déjà.')
        }
        const message = `La commande du Fournisseur n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllCommandeFournisseur = async (req: Request, res: Response) => {
    await myDataSource.getRepository(CommandeFournisseur).find({
        relations:{
            fournisseur: true
        }
    })
    .then((retour) => {
        const message = 'La liste des commandeFournisseurs a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des commandeFournisseurs n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getCommandeFournisseur = async (req: Request, res: Response) => {
    await myDataSource.getRepository(CommandeFournisseur).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            fournisseur:true,
    },
    })
    .then(commandeFournisseur => {
        if(commandeFournisseur === null) {
          const message = `L'commandeFournisseurdemandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `L'commandeFournisseura bien été trouvée.`
        return success(res,200, commandeFournisseur,message);
    })
    .catch(error => {
        const message = `L'commandeFournisseurn'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateCommandeFournisseur = async (req: Request, res: Response) => {
    const commandeFournisseur = await myDataSource.getRepository(CommandeFournisseur).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
           
            fournisseur:true,
        },
    }
    )
    if (!commandeFournisseur) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cet commandeFournisseur  existe déjà')
    }
    myDataSource.getRepository(CommandeFournisseur).merge(commandeFournisseur,req.body);
    const errors = await validate(commandeFournisseur);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(CommandeFournisseur).save(commandeFournisseur).then(commandeFournisseur => {
        const message = `L'commandeFournisseur${commandeFournisseur.id} a bien été modifié.`
        return success(res,200,commandeFournisseur,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cet commandeFournisseur existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cet commandeFournisseur existe déjà')
        }
        const message = `L'commandeFournisseurn'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteCommandeFournisseur = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('CommandeFournisseur', parseInt(req.params.id));
    await myDataSource.getRepository(CommandeFournisseur)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            fournisseur: true
           
        }
        })
    .then(commandeFournisseur => {        
        if(commandeFournisseur === null) {
          const message = `L'commandeFournisseurdemandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cet commandeFournisseur est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cet commandeFournisseur est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(CommandeFournisseur).softRemove(commandeFournisseur)
            .then(_ => {
                const message = `L'commandeFournisseuravec l'identifiant n°${commandeFournisseur.id} a bien été supprimé.`;
                return success(res,200, commandeFournisseur,message);
            })
        }
    }).catch(error => {
        const message = `L'commandeFournisseurn'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
