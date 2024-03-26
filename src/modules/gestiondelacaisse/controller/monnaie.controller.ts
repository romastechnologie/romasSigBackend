import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Monnaie } from "../entity/Monnaie";


export const createMonnaie = async (req: Request, res: Response) => {
    const monnaie = myDataSource.getRepository(Monnaie).create(req.body);
    const errors = await validate(monnaie)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Monnaie).save(monnaie)
    .then(monnaie => {
        const message = `La monnaie ${req.body.id} a bien été créée.`
        return success(res,201, monnaie,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette Monnaie  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette Monnaie  existe déjà.')
        }
        const message = `La Monnaie n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllMonnaie = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Monnaie).find({
        relations:{
            monnaiecaisses:true
        }
    })
    .then((retour) => {
        const message = 'La liste des Monnaies a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des Monnaies n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getMonnaie = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Monnaie).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            monnaiecaisses:true
    },
    })
    .then(monnaie => {
        if(monnaie === null) {
          const message = `La Monnaie demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La Monnaie a bien été trouvée.`
        return success(res,200, monnaie,message);
    })
    .catch(error => {
        const message = `La Monnaie n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateMonnaie = async (req: Request, res: Response) => {
    const monnaie = await myDataSource.getRepository(Monnaie).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            monnaiecaisses:true
        },
    }
    )
    if (!monnaie) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette Monnaie  existe déjà')
    }
    myDataSource.getRepository(Monnaie).merge(monnaie,req.body);
    const errors = await validate(monnaie);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Monnaie).save(monnaie).then(monnaie => {
        const message = `La Monnaie ${monnaie.id} a bien été modifiée.`
        return success(res,200,monnaie,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette Monnaie existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette Monnaie existe déjà')
        }
        const message = `La Monnaie n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteMonnaie = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Monnaie', parseInt(req.params.id));
    await myDataSource.getRepository(Monnaie)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            monnaiecaisses:true
        }
        })
    .then(monnaie => {        
        if(monnaie === null) {
          const message = `La Monnaie demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette Monnaie est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette Monnaie est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Monnaie).softRemove(monnaie)
            .then(_ => {
                const message = `La Monnaie avec l'identifiant n°${monnaie.id} a bien été supprimée.`;
                return success(res,200, monnaie,message);
            })
        }
    }).catch(error => {
        const message = `La Monnaie n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
