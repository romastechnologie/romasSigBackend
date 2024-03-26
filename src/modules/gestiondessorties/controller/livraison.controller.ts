import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { Livraison } from "../entity/Livraison";




export const createLivraison = async (req: Request, res: Response) => {
    const livraison = myDataSource.getRepository(Livraison).create(req.body);
    const errors = await validate(livraison)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Livraison).save(livraison)
    .then(livraison => {
        const message = `La livraison ${req.body.id} a bien été créée.`
        return success(res,201, livraison,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette livraison existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette livraison existe déjà.')
        }
        const message = `La livraison n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllLivraison = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Livraison).find({
        relations:{
            commandeclient:true,
            adreslivraison:true,
            procondimaglivraisons:true

        }
    })
    .then((retour) => {
        const message = 'La liste des livraisons a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des livraisons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getLivraison = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Livraison).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            commandeclient:true,
            adreslivraison:true,
            procondimaglivraisons:true

    },
    })
    .then(livraison => {
        if(livraison === null) {
          const message = `La livraison demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La livraison a bien été trouvée.`
        return success(res,200, livraison,message);
    })
    .catch(error => {
        const message = `La livraison n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateLivraison = async (req: Request, res: Response) => {
    const livraison = await myDataSource.getRepository(Livraison).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            commandeclient:true,
            adreslivraison:true,
            procondimaglivraisons:true
            
        },
    }
    )
    if (!livraison) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette livraison  existe déjà')
    }
    myDataSource.getRepository(Livraison).merge(livraison,req.body);
    const errors = await validate(livraison);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Livraison).save(livraison).then(livraison => {
        const message = `La livraison ${livraison.id} a bien été modifiée.`
        return success(res,200,livraison,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette livraison existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette livraison existe déjà')
        }
        const message = `La livraison n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteLivraison = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Livraison', parseInt(req.params.id));
    await myDataSource.getRepository(Livraison)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            commandeclient:true,
            adreslivraison:true,
            procondimaglivraisons:true

           
        }
        })
    .then(livraison => {        
        if(livraison === null) {
          const message = `La livraison demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette livraison est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette livraison est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Livraison).softRemove(livraison)
            .then(_ => {
                const message = `La livraison avec l'identifiant n°${livraison.id} a bien été supprimée.`;
                return success(res,200, livraison,message);
            })
        }
    }).catch(error => {
        const message = `La livraison n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
