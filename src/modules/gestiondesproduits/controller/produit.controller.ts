import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { Produit } from "../Produit";



export const createProduit = async (req: Request, res: Response) => {
    const produit = myDataSource.getRepository(Produit).create(req.body);
    const errors = await validate(produit)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Produit).save(produit)
    .then(produit => {
        const message = `Le produit ${req.body.id} a bien été créé.`
        return success(res,201, produit,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce produit  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce produit  existe déjà.')
        }
        const message = `Le produit n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllProduit = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Produit).find({
        relations:{
            produitconditionnements:true,
            famille:true
        }
    })
    .then((retour) => {
        const message = 'La liste des produits a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des produits n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getProduit = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Produit).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            produitconditionnements:true,
            famille:true
    },
    })
    .then(produit => {
        if(produit === null) {
          const message = `Le produit demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le produit a bien été trouvée.`
        return success(res,200, produit,message);
    })
    .catch(error => {
        const message = `Le produit n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateProduit = async (req: Request, res: Response) => {
    const produit = await myDataSource.getRepository(Produit).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            produitconditionnements:true,
            famille:true
            
        },
    }
    )
    if (!produit) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce produit  existe déjà')
    }
    myDataSource.getRepository(Produit).merge(produit,req.body);
    const errors = await validate(produit);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(produit).save(produit).then(produit => {
        const message = `Le produit ${produit.id} a bien été modifié.`
        return success(res,200,produit,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce produit existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce produit existe déjà')
        }
        const message = `Le produit n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteProduit = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Produit', parseInt(req.params.id));
    await myDataSource.getRepository(Produit)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            produitconditionnements:true,
            famille:true
           
        }
        })
    .then(produit => {        
        if(produit === null) {
          const message = `Le produit demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce produit est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce produit est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Produit).softRemove(produit)
            .then(_ => {
                const message = `Le produit avec l'identifiant n°${produit.id} a bien été supprimée.`;
                return success(res,200, produit,message);
            })
        }
    }).catch(error => {
        const message = `Le produit n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
