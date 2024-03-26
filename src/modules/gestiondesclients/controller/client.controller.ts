import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Client } from "../entity/Client";



export const createClient = async (req: Request, res: Response) => {
    const client = myDataSource.getRepository(Client).create(req.body);
    const errors = await validate(client)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Client).save(client)
    .then(client => {
        const message = `Le client ${req.body.id} a bien été créée.`
        return success(res,201, client,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce client  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce client  existe déjà.')
        }
        const message = `Le client n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllClient = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Client).find({
        relations:{
            adresselivrclients:true,
            commandeclients:true
        }
    })
    .then((retour) => {
        const message = 'La liste des clients a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des clients n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getClient = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Client).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            adresselivrclients:true,
            commandeclients:true
    },
    })
    .then(client => {
        if(client === null) {
          const message = `Le client demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le client a bien été trouvée.`
        return success(res,200, client,message);
    })
    .catch(error => {
        const message = `Le client n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateClient = async (req: Request, res: Response) => {
    const client = await myDataSource.getRepository(Client).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            adresselivrclients:true,
            commandeclients:true
     },
    }
    )
    if (!client) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce client  existe déjà')
    }
    myDataSource.getRepository(Client).merge(client,req.body);
    const errors = await validate(client);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Client).save(client).then(client => {
        const message = `Le client ${client.id} a bien été modifiée.`
        return success(res,200,client,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce client existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce client existe déjà')
        }
        const message = `Le client n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteClient = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Client', parseInt(req.params.id));
    await myDataSource.getRepository(Client)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            adresselivrclients:true,
            commandeclients:true
   }
        })
    .then(client => {        
        if(client === null) {
          const message = `Le client demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce client est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce client est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Client).softRemove(client)
            .then(_ => {
                const message = `Le client avec l'identifiant n°${client.id} a bien été supprimée.`;
                return success(res,200, client,message);
            })
        }
    }).catch(error => {
        const message = `Le client n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
