import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Caisse } from "../entity/Caisse";



export const createCaisse = async (req: Request, res: Response) => {
    const caisse = myDataSource.getRepository(Caisse).create(req.body);
    const errors = await validate(caisse)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Caisse).save(caisse)
    .then(Caisse => {
        const message = `La Caisse ${req.body.id} a bien été créée.`
        return success(res,201, caisse,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette caisse  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette caisse  existe déjà.')
        }
        const message = `La caisse n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllCaisse = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Caisse).find({
        relations:{
            monnaiecaisses:true,
            caisseusers:true
        }
    })
    .then((retour) => {
        const message = 'La liste des Caisses a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des Caisses n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getCaisse = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Caisse).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            monnaiecaisses:true,
            caisseusers:true
    },
    })
    .then(caisse => {
        if(caisse === null) {
          const message = `La caisse demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La caisse a bien été trouvée.`
        return success(res,200, caisse,message);
    })
    .catch(error => {
        const message = `La caisse n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateCaisse = async (req: Request, res: Response) => {
    const caisse = await myDataSource.getRepository(Caisse).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            monnaiecaisses:true,
            caisseusers:true
        },
    }
    )
    if (!caisse) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette caisse  existe déjà')
    }
    myDataSource.getRepository(Caisse).merge(caisse,req.body);
    const errors = await validate(caisse);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Caisse).save(caisse).then(caisse => {
        const message = `La caisse ${caisse.id} a bien été modifiée.`
        return success(res,200,caisse,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette caisse existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette caisse existe déjà')
        }
        const message = `La caisse n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteCaisse = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Caisse', parseInt(req.params.id));
    await myDataSource.getRepository(Caisse)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            monnaiecaisses:true,
            caisseusers:true
        }
        })
    .then(caisse => {        
        if(caisse === null) {
          const message = `La caisse demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette caisse est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette caisse est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Caisse).softRemove(caisse)
            .then(_ => {
                const message = `La caisse avec l'identifiant n°${caisse.id} a bien été supprimée.`;
                return success(res,200, caisse,message);
            })
        }
    }).catch(error => {
        const message = `La caisse n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
