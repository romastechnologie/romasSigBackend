import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Famille } from "../entity/Famille";




export const createFamille = async (req: Request, res: Response) => {
    const famille = myDataSource.getRepository(Famille).create(req.body);
    const errors = await validate(famille)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Famille).save(famille)
    .then(famille => {
        const message = `La famille ${req.body.id} a bien été créée.`
        return success(res,201,famille,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette famille  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette famille  existe déjà.')
        }
        const message = `La famille n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllFamille = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Famille).find({
        relations:{
            produits:true,
            famille:true,
            familles:true
        }
    })
    .then((retour) => {
        const message = 'La liste des familles a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des familles n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getFamille = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Famille).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            produits:true,
            famille:true,
            familles:true
    },
    })
    .then(famille => {
        if(famille === null) {
          const message = `La famille demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La famille a bien été trouvée.`
        return success(res,200, famille,message);
    })
    .catch(error => {
        const message = `La famille n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateFamille = async (req: Request, res: Response) => {
    const famille = await myDataSource.getRepository(Famille).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            produits:true,
            famille:true,
            familles:true
        },
    }
    )
    if (!famille) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette famille  existe déjà')
    }
    myDataSource.getRepository(Famille).merge(famille,req.body);
    const errors = await validate(famille);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Famille).save(famille).then(famille => {
        const message = `La famille ${famille.id} a bien été modifiée.`
        return success(res,200,famille,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette famille existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette famille existe déjà')
        }
        const message = `La famille n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteFamille = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Famille', parseInt(req.params.id));
    await myDataSource.getRepository(Famille)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            produits:true,
            famille:true,
            familles:true
        }
        })
    .then(famille => {        
        if(famille === null) {
          const message = `La famille demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette famille est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette famille est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Famille).softRemove(famille)
            .then(_ => {
                const message = `La famille avec l'identifiant n°${famille.id} a bien été supprimée.`;
                return success(res,200, famille,message);
            })
        }
    }).catch(error => {
        const message = `La famille n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
