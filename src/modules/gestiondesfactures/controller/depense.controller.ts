import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Depense } from "../entity/Depense";



export const createDepense = async (req: Request, res: Response) => {
    const depense = myDataSource.getRepository(Depense).create(req.body);
    const errors = await validate(depense)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Depense).save(depense)
    .then(depense => {
        const message = `La dépense ${req.body.id} a bien été créée.`
        return success(res,201, depense,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce depense  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce depense  existe déjà.')
        }
        const message = `La dépense n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllDepense = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Depense).find({
        // relations:{
        //     transfert:true
        // }
    })
    .then((retour) => {
        const message = 'La liste des dépenses a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des dépenses n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getDepense = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Depense).findOne({
        where: {
            id: parseInt(req.params.id),
        },
    //     relations: {
    //         modedepense:true,
    //         facture:true,
    //         transfert:true
    // },
    })
    .then(depense => {
        if(depense === null) {
          const message = `La dépense demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La dépense a bien été trouvée.`
        return success(res,200, depense,message);
    })
    .catch(error => {
        const message = `La dépense n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateDepense = async (req: Request, res: Response) => {
    const depense = await myDataSource.getRepository(Depense).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
    //     relations: {
    //         modedepense:true,
    //         facture:true,
    //         transfert:true
    //  },
    }
    )
    if (!depense) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce depense  existe déjà')
    }
    myDataSource.getRepository(Depense).merge(depense,req.body);
    const errors = await validate(depense);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Depense).save(depense).then(depense => {
        const message = `La dépense ${depense.id} a bien été modifiée.`
        return success(res,200,depense,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce depense existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce depense existe déjà')
        }
        const message = `La dépense n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteDepense = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Depense', parseInt(req.params.id));
    await myDataSource.getRepository(Depense)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
//         relations:{
//             modedepense:true,
//             facture:true,
//             transfert:true
//    }
        })
    .then(depense => {        
        if(depense === null) {
          const message = `La dépense demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce depense est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce depense est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Depense).softRemove(depense)
            .then(_ => {
                const message = `La dépense avec l'identifiant n°${depense.id} a bien été supprimée.`;
                return success(res,200, depense,message);
            })
        }
    }).catch(error => {
        const message = `La dépense n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
