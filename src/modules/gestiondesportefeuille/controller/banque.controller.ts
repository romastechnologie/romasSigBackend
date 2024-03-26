import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { Banque } from "../entity/Banque";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";




export const createBanque = async (req: Request, res: Response) => {
    const banque = myDataSource.getRepository(Banque).create(req.body);
    const errors = await validate(banque)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Banque).save(banque)
    .then(banque => {
        const message = `La banque ${req.body.id} a bien été créé.`
        return success(res,201, banque,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette banque  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette banque  existe déjà.')
        }
        const message = `La banque n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllBanque = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Banque).find({
        relations:{
            societe:true,
            banquetransacs:true
        }
    })
    .then((retour) => {
        const message = 'La liste des banques a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des banques n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getBanque = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Banque).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            societe:true,
            banquetransacs:true
    },
    })
    .then(banque => {
        if(banque === null) {
          const message = `La banque demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `La banque a bien été trouvée.`
        return success(res,200, banque,message);
    })
    .catch(error => {
        const message = `La banque n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateBanque = async (req: Request, res: Response) => {
    const banque = await myDataSource.getRepository(Banque).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            societe:true,
            banquetransacs:true
        },
    }
    )
    if (!banque) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette banque  existe déjà')
    }
    myDataSource.getRepository(Banque).merge(banque,req.body);
    const errors = await validate(banque);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Banque).save(banque).then(banque => {
        const message = `La banque ${banque.id} a bien été modifié.`
        return success(res,200,banque,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette banque existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette banque existe déjà')
        }
        const message = `La banque n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteBanque = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Banque', parseInt(req.params.id));
    await myDataSource.getRepository(Banque)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            societe:true,
            banquetransacs:true
        }
        })
    .then(banque => {        
        if(banque === null) {
          const message = `La banque demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette banque est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette banque est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Banque).softRemove(banque)
            .then(_ => {
                const message = `La banque avec l'identifiant n°${banque.id} a bien été supprimée.`;
                return success(res,200, banque,message);
            })
        }
    }).catch(error => {
        const message = `La banque n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
