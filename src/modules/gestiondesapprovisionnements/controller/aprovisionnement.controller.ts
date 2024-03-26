import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../../configs/checkRelationsOneToManyBeforDelete";
import { Approvisionnement } from "../entity/Approvisionnement";




export const createApprovisionnement = async (req: Request, res: Response) => {
    const approvisionnement = myDataSource.getRepository(Approvisionnement).create(req.body);
    const errors = await validate(approvisionnement)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Approvisionnement).save(approvisionnement)
    .then(approvisionnement => {
        const message = `L'approvisionnement${req.body.id} a bien été créé.`
        return success(res,201, approvisionnement,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cet approvisionnement  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cet approvisionnement  existe déjà.')
        }
        const message = `L'approvisionnementn'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllApprovisionnement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Approvisionnement).find({
        relations:{
            commandefourniseur:true,
            apropocondis: true
        }
    })
    .then((retour) => {
        const message = 'La liste des approvisionnements a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des approvisionnements n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getApprovisionnement = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Approvisionnement).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            commandefourniseur:true,
            apropocondis: true
    },
    })
    .then(approvisionnement => {
        if(approvisionnement === null) {
          const message = `L'approvisionnementdemandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `L'approvisionnementa bien été trouvée.`
        return success(res,200, approvisionnement,message);
    })
    .catch(error => {
        const message = `L'approvisionnementn'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateApprovisionnement = async (req: Request, res: Response) => {
    const approvisionnement = await myDataSource.getRepository(Approvisionnement).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
           
            commandefourniseur:true,
            apropocondis: true
        },
    }
    )
    if (!approvisionnement) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cet approvisionnement  existe déjà')
    }
    myDataSource.getRepository(Approvisionnement).merge(approvisionnement,req.body);
    const errors = await validate(approvisionnement);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Approvisionnement).save(approvisionnement).then(approvisionnement => {
        const message = `L'approvisionnement${approvisionnement.id} a bien été modifié.`
        return success(res,200,approvisionnement,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cet approvisionnement existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cet approvisionnement existe déjà')
        }
        const message = `L'approvisionnementn'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteApprovisionnement = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Approvisionnement', parseInt(req.params.id));
    await myDataSource.getRepository(Approvisionnement)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            commandefourniseur:true,
            apropocondis: true
           
        }
        })
    .then(approvisionnement => {        
        if(approvisionnement === null) {
          const message = `L'approvisionnementdemandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cet approvisionnement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cet approvisionnement est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Approvisionnement).softRemove(approvisionnement)
            .then(_ => {
                const message = `L'approvisionnementavec l'identifiant n°${approvisionnement.id} a bien été supprimé.`;
                return success(res,200, approvisionnement,message);
            })
        }
    }).catch(error => {
        const message = `L'approvisionnementn'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
