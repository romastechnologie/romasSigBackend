import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { TypeTaxe } from "../entity/TypeTaxe";




export const createTypeTaxe= async (req: Request, res: Response) => {
    const typeTaxe = myDataSource.getRepository(TypeTaxe).create(req.body);
    const errors = await validate(typeTaxe)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeTaxe).save(typeTaxe)
    .then(typeTaxe => {
        const message = `Le type de taxe${req.body.id} a bien été créé.`
        return success(res,201, typeTaxe,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de taxe existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de taxe  existe déjà.')
        }
        const message = `Le type de taxe n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllTypeTaxe = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeTaxe).find({
        relations:{
            taxes:true,
        }
    })
    .then((retour) => {
        const message = 'La liste des typeTaxes a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des typeTaxes n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getTypeTaxe = async (req: Request, res: Response) => {
    await myDataSource.getRepository(TypeTaxe).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            taxes:true,
    },
    })
    .then(typeTaxe => {
        if(typeTaxe === null) {
          const message = `Le type de taxedemandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le type de taxea bien été trouvée.`
        return success(res,200, typeTaxe,message);
    })
    .catch(error => {
        const message = `Le type de taxe n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateTypeTaxe = async (req: Request, res: Response) => {
    const typeTaxe = await myDataSource.getRepository(TypeTaxe).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            taxes:true,
            
        },
    }
    )
    if (!typeTaxe) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce type de taxe existe déjà')
    }
    myDataSource.getRepository(TypeTaxe).merge(typeTaxe,req.body);
    const errors = await validate(typeTaxe);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(TypeTaxe).save(typeTaxe).then(typeTaxe => {
        const message = `Le type de taxe${typeTaxe.id} a bien été modifié.`
        return success(res,200,typeTaxe,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce type de taxe existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce type de taxe existe déjà')
        }
        const message = `Le type de taxe n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteTypeTaxe = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('TypeTaxe', parseInt(req.params.id));
    await myDataSource.getRepository(TypeTaxe)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            taxes:true,
           
        }
        })
    .then(typeTaxe => {        
        if(typeTaxe === null) {
          const message = `Le type de taxedemandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce type de taxeest lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce type de taxeest lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(TypeTaxe).softRemove(typeTaxe)
            .then(_ => {
                const message = `Le type de taxeavec l'identifiant n°${typeTaxe.id} a bien été supprimée.`;
                return success(res,200, typeTaxe,message);
            })
        }
    }).catch(error => {
        const message = `Le type de taxe n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
