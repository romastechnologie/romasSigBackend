import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Depot } from "../entity/Depot";


export const createDepot = async (req: Request, res: Response) => {
    const depot = myDataSource.getRepository(Depot).create(req.body);
    const errors = await validate(depot)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Depot).save(depot)
    .then(depot => {
        const message = `Le dépôt ${req.body.id} a bien été créée.`
        return success(res,201, depot,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce dépôt  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce dépôt  existe déjà.')
        }
        const message = `Le dépôt n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllDepot = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Depot).find({
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

export const getDepot = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Depot).findOne({
        where: {
            id: parseInt(req.params.id),
        },
    //     relations: {
    //         modedepot:true,
    //         facture:true,
    //         transfert:true
    // },
    })
    .then(depot => {
        if(depot === null) {
          const message = `Le dépôt demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le dépôt a bien été trouvée.`
        return success(res,200, depot,message);
    })
    .catch(error => {
        const message = `Le dépôt n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateDepot = async (req: Request, res: Response) => {
    const depot = await myDataSource.getRepository(Depot).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
    //     relations: {
    //         modedepot:true,
    //         facture:true,
    //         transfert:true
    //  },
    }
    )
    if (!depot) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce dépôt  existe déjà')
    }
    myDataSource.getRepository(Depot).merge(depot,req.body);
    const errors = await validate(depot);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Depot).save(depot).then(depot => {
        const message = `Le dépôt ${depot.id} a bien été modifiée.`
        return success(res,200,depot,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce dépôt existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce dépôt existe déjà')
        }
        const message = `Le dépôt n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteDepot = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Depot', parseInt(req.params.id));
    await myDataSource.getRepository(Depot)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
//         relations:{
//             modedepot:true,
//             facture:true,
//             transfert:true
//    }
        })
    .then(depot => {        
        if(depot === null) {
          const message = `Le dépôt demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce dépôt est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce dépôt est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Depot).softRemove(depot)
            .then(_ => {
                const message = `Le dépôt avec l'identifiant n°${depot.id} a bien été supprimée.`;
                return success(res,200, depot,message);
            })
        }
    }).catch(error => {
        const message = `Le dépôt n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
