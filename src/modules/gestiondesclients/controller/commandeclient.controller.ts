import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { CommandeClient } from "../entity/CommandeClient";



export const createCommandeClient = async (req: Request, res: Response) => {
    const commandeClient = myDataSource.getRepository(CommandeClient).create(req.body);
    const errors = await validate(commandeClient)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(CommandeClient).save(commandeClient)
    .then(commandeClient => {
        const message = `La commande du client ${req.body.id} a bien été créée.`
        return success(res,201, commandeClient,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce commandeClient  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce commandeClient  existe déjà.')
        }
        const message = `La commandeClient n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllCommandeClient = async (req: Request, res: Response) => {
    await myDataSource.getRepository(CommandeClient).find({
        relations:{
            client:true,
            adresseLivraison:true
        }
    })
    .then((retour) => {
        const message = 'La liste des commandeClients a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des commandeClients n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getCommandeClient = async (req: Request, res: Response) => {
    await myDataSource.getRepository(CommandeClient).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            client:true,
            adresseLivraison:true
    },
    })
    .then(commandeClient => {
        if(commandeClient === null) {
          const message = `La commandeClient demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La commandeClient a bien été trouvée.`
        return success(res,200, commandeClient,message);
    })
    .catch(error => {
        const message = `La commandeClient n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateCommandeClient = async (req: Request, res: Response) => {
    const commandeClient = await myDataSource.getRepository(CommandeClient).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            client:true,
            adresseLivraison:true
     },
    }
    )
    if (!commandeClient) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce commandeClient  existe déjà')
    }
    myDataSource.getRepository(CommandeClient).merge(commandeClient,req.body);
    const errors = await validate(commandeClient);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(CommandeClient).save(commandeClient).then(commandeClient => {
        const message = `La commandeClient ${commandeClient.id} a bien été modifiée.`
        return success(res,200,commandeClient,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce commandeClient existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce commandeClient existe déjà')
        }
        const message = `La commandeClient n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteCommandeClient = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('CommandeClient', parseInt(req.params.id));
    await myDataSource.getRepository(CommandeClient)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            client:true,
            adresseLivraison:true
   }
        })
    .then(commandeClient => {        
        if(commandeClient === null) {
          const message = `La commande du Client demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette commande du client est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce commandeClient est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(CommandeClient).softRemove(commandeClient)
            .then(_ => {
                const message = `La commande du Client avec l'identifiant n°${commandeClient.id} a bien été supprimée.`;
                return success(res,200, commandeClient,message);
            })
        }
    }).catch(error => {
        const message = `La commande du Client n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
