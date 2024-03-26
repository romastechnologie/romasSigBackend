import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { AdresseLivraison } from "../entity/AdresseLivraison";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";




export const createAdresseLivraison = async (req: Request, res: Response) => {
    const adresseLivraison = myDataSource.getRepository(AdresseLivraison).create(req.body);
    const errors = await validate(adresseLivraison)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(AdresseLivraison).save(adresseLivraison)
    .then(adresseLivraison => {
        const message = `L' adresseLivraison ${req.body.id} a bien été créé.`
        return success(res,201, adresseLivraison,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette adresseLivraison  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette adresseLivraison  existe déjà.')
        }
        const message = `L' adresseLivraison n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllAdresseLivraison = async (req: Request, res: Response) => {
    await myDataSource.getRepository(AdresseLivraison).find({
        relations:{
            commandeclients:true,
            client:true
        }
    })
    .then((retour) => {
        const message = 'La liste des adresseLivraisons a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des adresseLivraisons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getAdresseLivraison = async (req: Request, res: Response) => {
    await myDataSource.getRepository(AdresseLivraison).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            commandeclients:true,
            client:true
    },
    })
    .then(adresseLivraison => {
        if(adresseLivraison === null) {
          const message = `L' adresseLivraison demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `L' adresseLivraison a bien été trouvée.`
        return success(res,200, adresseLivraison,message);
    })
    .catch(error => {
        const message = `L' adresseLivraison n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateAdresseLivraison = async (req: Request, res: Response) => {
    const adresseLivraison = await myDataSource.getRepository(AdresseLivraison).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            commandeclients:true,
            client:true
            
        },
    }
    )
    if (!adresseLivraison) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette adresseLivraison  existe déjà')
    }
    myDataSource.getRepository(AdresseLivraison).merge(adresseLivraison,req.body);
    const errors = await validate(adresseLivraison);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(AdresseLivraison).save(adresseLivraison).then(adresseLivraison => {
        const message = `L' adresseLivraison ${adresseLivraison.id} a bien été modifié.`
        return success(res,200,adresseLivraison,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette adresseLivraison existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette adresseLivraison existe déjà')
        }
        const message = `L' adresseLivraison n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteAdresseLivraison = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('adresseLivraison', parseInt(req.params.id));
    await myDataSource.getRepository(AdresseLivraison)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            commandeclients:true,
            client:true
           
        }
        })
    .then(adresseLivraison => {        
        if(adresseLivraison === null) {
          const message = `L' adresseLivraison demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette adresseLivraison est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette adresseLivraison est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(AdresseLivraison).softRemove(adresseLivraison)
            .then(_ => {
                const message = `L' adresseLivraison avec l'identifiant n°${adresseLivraison.id} a bien été supprimée.`;
                return success(res,200, adresseLivraison,message);
            })
        }
    }).catch(error => {
        const message = `L'adresseLivraison n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
