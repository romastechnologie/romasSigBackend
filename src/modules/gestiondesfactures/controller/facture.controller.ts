import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Facture } from "../entity/Facture";



export const createFacture = async (req: Request, res: Response) => {
    const facture = myDataSource.getRepository(Facture).create(req.body);
    const errors = await validate(facture)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Facture).save(facture)
    .then(facture => {
        const message = `La facture ${req.body.id} a bien été créée.`
        return success(res,201, facture,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette facture  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette facture  existe déjà.')
        }
        const message = `La facture n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllFacture = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Facture).find({
        relations:{
            facturepaiements:true,
            factureprocondis:true,
            commandeclient:true
        }
    })
    .then((retour) => {
        const message = 'La liste des factures a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des factures n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getFacture = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Facture).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            facturepaiements:true,
            factureprocondis:true,
            commandeclient:true
    },
    })
    .then(facture => {
        if(facture === null) {
          const message = `La facture demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La facture a bien été trouvée.`
        return success(res,200, facture,message);
    })
    .catch(error => {
        const message = `La facture n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateFacture = async (req: Request, res: Response) => {
    const facture = await myDataSource.getRepository(Facture).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            facturepaiements:true,
            factureprocondis:true,
            commandeclient:true
     },
    }
    )
    if (!facture) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette facture existe déjà')
    }
    myDataSource.getRepository(Facture).merge(facture,req.body);
    const errors = await validate(facture);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Facture).save(facture).then(facture => {
        const message = `La facture ${facture.id} a bien été modifiée.`
        return success(res,200,facture,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette facture existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette facture existe déjà')
        }
        const message = `La facture n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteFacture = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Facture', parseInt(req.params.id));
    await myDataSource.getRepository(Facture)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            facturepaiements:true,
            factureprocondis:true,
            commandeclient:true

   }
        })
    .then(facture => {        
        if(facture === null) {
          const message = `La facture demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette facture est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette facture est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Facture).softRemove(facture)
            .then(_ => {
                const message = `La facture avec l'identifiant n°${facture.id} a bien été supprimée.`;
                return success(res,200, facture,message);
            })
        }
    }).catch(error => {
        const message = `La facture n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
