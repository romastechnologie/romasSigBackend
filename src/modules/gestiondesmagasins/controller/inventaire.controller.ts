import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { Inventaire } from "../entity/Inventaire";




export const createInventaire = async (req: Request, res: Response) => {
    const inventaire = myDataSource.getRepository(Inventaire).create(req.body);
    const errors = await validate(inventaire)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Inventaire).save(inventaire)
    .then(inventaire => {
        const message = `L'inventaire ${req.body.id} a bien été créé.`
        return success(res,201, inventaire,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cet inventaire  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cet inventaire  existe déjà.')
        }
        const message = `L'inventaire n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllInventaire = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Inventaire).find({
        relations:{
            inventaiprocondimags:true
        }
    })
    .then((retour) => {
        const message = 'La liste des inventaires a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des inventaires n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getInventaire = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Inventaire).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            inventaiprocondimags:true
    },
    })
    .then(inventaire => {
        if(inventaire === null) {
          const message = `L'inventaire demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `L'inventaire a bien été trouvée.`
        return success(res,200, inventaire,message);
    })
    .catch(error => {
        const message = `L'inventaire n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateInventaire = async (req: Request, res: Response) => {
    const inventaire = await myDataSource.getRepository(Inventaire).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            inventaiprocondimags:true
            
        },
    }
    )
    if (!inventaire) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cet inventaire  existe déjà')
    }
    myDataSource.getRepository(Inventaire).merge(inventaire,req.body);
    const errors = await validate(inventaire);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Inventaire).save(inventaire).then(inventaire => {
        const message = `L'inventaire ${inventaire.id} a bien été modifié.`
        return success(res,200,inventaire,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cet inventaire existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cet inventaire existe déjà')
        }
        const message = `L'inventaire n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteInventaire = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Inventaire', parseInt(req.params.id));
    await myDataSource.getRepository(Inventaire)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            inventaiprocondimags:true
           
        }
        })
    .then(inventaire => {        
        if(inventaire === null) {
          const message = `L'inventaire demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cet inventaire est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cet inventaire est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Inventaire).softRemove(inventaire)
            .then(_ => {
                const message = `L'inventaire avec l'identifiant n°${inventaire.id} a bien été supprimée.`;
                return success(res,200, inventaire,message);
            })
        }
    }).catch(error => {
        const message = `L'inventaire n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
