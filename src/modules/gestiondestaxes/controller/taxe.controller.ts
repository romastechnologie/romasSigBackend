import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Taxe } from "../entity/Taxe";




export const createTaxe = async (req: Request, res: Response) => {
    const taxe = myDataSource.getRepository(Taxe).create(req.body);
    const errors = await validate(taxe)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Taxe).save(taxe)
    .then(taxe => {
        const message = `La taxe ${req.body.id} a bien été créé.`
        return success(res,201, taxe,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette taxe  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette taxe  existe déjà.')
        }
        const message = `La taxe n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTaxe = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Taxe).find({
        relations:{
            typeTaxe:true,
            
        }
    })
    .then((retour) => {
        const message = 'La liste des taxes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des taxes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTaxe = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Taxe).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            typeTaxe:true,
            
    },
    })
    .then(taxe => {
        if(taxe === null) {
          const message = `La taxe demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La taxe a bien été trouvée.`
        return success(res,200, taxe,message);
    })
    .catch(error => {
        const message = `La taxe n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTaxe = async (req: Request, res: Response) => {
    const taxe = await myDataSource.getRepository(Taxe).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            typeTaxe:true,
            
            
        },
    }
    )
    if (!taxe) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette taxe  existe déjà')
    }
    myDataSource.getRepository(Taxe).merge(taxe,req.body);
    const errors = await validate(taxe);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Taxe).save(taxe).then(taxe => {
        const message = `La taxe ${taxe.id} a bien été modifié.`
        return success(res,200,taxe,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette taxe existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette taxe existe déjà')
        }
        const message = `La taxe n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTaxe = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Taxe', parseInt(req.params.id));
    await myDataSource.getRepository(Taxe)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            typeTaxe:true,
            
        }
        })
    .then(taxe => {        
        if(taxe === null) {
          const message = `La taxe demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette taxe est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette taxe est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Taxe).softRemove(taxe)
            .then(_ => {
                const message = `La taxe avec l'identifiant n°${taxe.id} a bien été supprimée.`;
                return success(res,200, taxe,message);
            })
        }
    }).catch(error => {
        const message = `La taxe n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
