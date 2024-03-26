import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Conditionnement } from "../entity/Conditionnement";



export const createConditionnement = async (req: Request, res: Response) => {
    const conditionnement = myDataSource.getRepository(Conditionnement).create(req.body);
    const errors = await validate(conditionnement)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Conditionnement).save(conditionnement)
    .then(conditionnement => {
        const message = `Le conditionnement ${req.body.id} a bien été créée.`
        return success(res,201, conditionnement,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce conditionnement  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce conditionnement  existe déjà.')
        }
        const message = `Le conditionnement n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllConditionnement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Conditionnement).find({
        relations:{
            produitconditionnements:true,
        }
    })
    .then((retour) => {
        const message = 'La liste des conditionnements a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des conditionnements n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getConditionnement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Conditionnement).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            produitconditionnements:true,
    },
    })
    .then(conditionnement => {
        if(conditionnement === null) {
          const message = `Le conditionnement demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le conditionnement a bien été trouvée.`
        return success(res,200, conditionnement,message);
    })
    .catch(error => {
        const message = `Le conditionnement n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateConditionnement = async (req: Request, res: Response) => {
    const conditionnement = await myDataSource.getRepository(Conditionnement).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            produitconditionnements:true,
     },
    }
    )
    if (!conditionnement) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce conditionnement  existe déjà')
    }
    myDataSource.getRepository(Conditionnement).merge(conditionnement,req.body);
    const errors = await validate(conditionnement);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Conditionnement).save(conditionnement).then(conditionnement => {
        const message = `Le conditionnement ${conditionnement.id} a bien été modifiée.`
        return success(res,200,conditionnement,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce conditionnement existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce conditionnement existe déjà')
        }
        const message = `Le conditionnement n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteConditionnement = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Conditionnement', parseInt(req.params.id));
    await myDataSource.getRepository(Conditionnement)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            produitconditionnements:true,
   }
        })
    .then(conditionnement => {        
        if(conditionnement === null) {
          const message = `Le conditionnement demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce conditionnement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce conditionnement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Conditionnement).softRemove(conditionnement)
            .then(_ => {
                const message = `Le conditionnement avec l'identifiant n°${conditionnement.id} a bien été supprimée.`;
                return success(res,200, conditionnement,message);
            })
        }
    }).catch(error => {
        const message = `Le conditionnement n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
