import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { ModePaiement } from "../entity/ModePaiement";



export const createModePaiement = async (req: Request, res: Response) => {
    const modePaiement = myDataSource.getRepository(ModePaiement).create(req.body);
    const errors = await validate(modePaiement)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(ModePaiement).save(modePaiement)
    .then(modePaiement => {
        const message = `Le mode de paiement ${req.body.id} a bien été créée.`
        return success(res,201, modePaiement,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce mode de paiement  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce mode de paiement  existe déjà.')
        }
        const message = `Le mode de paiement n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllModePaiement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(ModePaiement).find({
        relations:{
            modepaiements:true,
        }
    })
    .then((retour) => {
        const message = 'La liste des modePaiements a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des modePaiements n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getModePaiement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(ModePaiement).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            modepaiements:true,
    },
    })
    .then(modePaiement => {
        if(modePaiement === null) {
          const message = `Le mode de paiement demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le mode de paiement a bien été trouvée.`
        return success(res,200, modePaiement,message);
    })
    .catch(error => {
        const message = `Le mode de paiement n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateModePaiement = async (req: Request, res: Response) => {
    const modePaiement = await myDataSource.getRepository(ModePaiement).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            modepaiements:true,
     },
    }
    )
    if (!modePaiement) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce mode de paiement  existe déjà')
    }
    myDataSource.getRepository(ModePaiement).merge(modePaiement,req.body);
    const errors = await validate(modePaiement);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(ModePaiement).save(modePaiement).then(modePaiement => {
        const message = `Le mode de paiement ${modePaiement.id} a bien été modifiée.`
        return success(res,200,modePaiement,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce mode de paiement existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce mode de paiement existe déjà')
        }
        const message = `Le mode de paiement n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteModePaiement = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('ModePaiement', parseInt(req.params.id));
    await myDataSource.getRepository(ModePaiement)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            modepaiements:true,
   }
        })
    .then(modePaiement => {        
        if(modePaiement === null) {
          const message = `Le mode de paiement demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce mode de paiement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce mode de paiement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(ModePaiement).softRemove(modePaiement)
            .then(_ => {
                const message = `Le mode de paiement avec l'identifiant n°${modePaiement.id} a bien été supprimée.`;
                return success(res,200, modePaiement,message);
            })
        }
    }).catch(error => {
        const message = `Le mode de paiement n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
