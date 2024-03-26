import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";




export const createMagasin = async (req: Request, res: Response) => {
    const magasin = myDataSource.getRepository(Magasin).create(req.body);
    const errors = await validate(magasin)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Magasin).save(magasin)
    .then(magasin => {
        const message = `Le magasin ${req.body.id} a bien été créé.`
        return success(res,201, magasin,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce magasin  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce magasin  existe déjà.')
        }
        const message = `Le magasin n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllMagasin = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Magasin).find({
        relations:{
            
        }
    })
    .then((retour) => {
        const message = 'La liste des magasins a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des magasins n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getMagasin = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Magasin).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            
    },
    })
    .then(magasin => {
        if(magasin === null) {
          const message = `Le magasin demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le magasin a bien été trouvée.`
        return success(res,200, magasin,message);
    })
    .catch(error => {
        const message = `Le magasin n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateMagasin = async (req: Request, res: Response) => {
    const magasin = await myDataSource.getRepository(Magasin).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
           
            
        },
    }
    )
    if (!magasin) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce magasin  existe déjà')
    }
    myDataSource.getRepository(Magasin).merge(magasin,req.body);
    const errors = await validate(magasin);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Magasin).save(magasin).then(magasin => {
        const message = `Le magasin ${magasin.id} a bien été modifié.`
        return success(res,200,magasin,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce magasin existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce magasin existe déjà')
        }
        const message = `Le magasin n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteMagasin = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Magasin', parseInt(req.params.id));
    await myDataSource.getRepository(Magasin)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
           
           
        }
        })
    .then(magasin => {        
        if(magasin === null) {
          const message = `Le magasin demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce magasin est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce magasin est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Magasin).softRemove(magasin)
            .then(_ => {
                const message = `Le magasin avec l'identifiant n°${magasin.id} a bien été supprimée.`;
                return success(res,200, magasin,message);
            })
        }
    }).catch(error => {
        const message = `Le magasin n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
