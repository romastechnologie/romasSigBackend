import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Element } from "../entity/Element";


export const createElement = async (req: Request, res: Response) => {
    const element = myDataSource.getRepository(Element).create(req.body);
    const errors = await validate(element)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Element).save(element)
    .then(element => {
        const message = `L\' element ${req.body.id} a bien été créé.`
        return success(res,201, element,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette element  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette element  existe déjà.')
        }
        const message = `L\' element n'a pas pu être ajouté. Réssayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllElement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Element).find({
    })
    .then((retour) => {
        const message = 'La liste des elements a bien été récupéré.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des elements n'a pas pu être récupéré. Réssayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getElement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Element).findOne({
        where: {
            id: parseInt(req.params.id),
        }
    })
    .then(element => {
        if(element === null) {
          const message = `L\' element demandé n'existe pas. Réssayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `L\' element a bien été trouvé.`
        return success(res,200, element,message);
    })
    .catch(error => {
        const message = `L\' element n'a pas pu être récupéré. Réssayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateElement = async (req: Request, res: Response) => {
    const element = await myDataSource.getRepository(Element).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        }
    }
    )
    if (!element) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette element  existe déjà')
    }
    myDataSource.getRepository(Element).merge(element,req.body);
    const errors = await validate(element);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Element).save(element).then(element => {
        const message = `L\' element ${element.id} a bien été modifié.`
        return success(res,200,element,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette element existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette element existe déjà')
        }
        const message = `L\' element n'a pas pu être ajouté. Réssayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteElement = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Element', parseInt(req.params.id));
    await myDataSource.getRepository(Element)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        }
        })
    .then(element => {        
        if(element === null) {
          const message = `L\' element demandé n'existe pas. Réssayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette element est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette element est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Element).softRemove(element)
            .then(_ => {
                const message = `L\' element avec l'identifiant n°${element.id} a bien été supprimé.`;
                return success(res,200, element,message);
            })
        }
    }).catch(error => {
        const message = `L\' element n'a pas pu être supprimé. Réssayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
