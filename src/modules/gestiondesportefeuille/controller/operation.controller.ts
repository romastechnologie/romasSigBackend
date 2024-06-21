import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";
import { Operation } from "../entity/Operation";
import { Compte } from "../entity/Compte";



export const createOperation = async (req: Request, res: Response) => {
    const operation = myDataSource.getRepository(Operation).create(req.body);
    const errors = await validate(operation)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Operation).save(operation)
    .then(operation => {
        const message = `L'opération${req.body.id} a bien été créée.`
        return success(res,201, operation,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette opération  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette opération  existe déjà.')
        }
        const message = `L'opération n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const encaissementOperation = async (req: Request, res: Response) => {
    
    const operation = myDataSource.getRepository(Operation).create({
        ...req.body,
        nature: "Crédit"});

    const errors = await validate(operation);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res, 400, errors, message);
    }

        const compte = await myDataSource.getRepository(Compte).findOne({
            where: {
                id: parseInt(req.body.compte),
            },
        });

        if (!compte) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        const nouveauSolde = compte.soldeActuel + req.body.montant;
        compte.soldeActuel = nouveauSolde;

    await myDataSource.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.getRepository(Operation).save(operation);
        await transactionalEntityManager.getRepository(Compte).save(compte);

    }).then(data => {
        const message = `L'opération a bien été créée.`;
        return success(res, 200, operation, message);
    }).catch(error=>{
        return res.status(500).json({ message: "Erreur lors de l'opération d'encaissement" });
    })
};

export const decaissementOperation = async (req: Request, res: Response) => {
    const operation = myDataSource.getRepository(Operation).create({
        ...req.body,
        nature: "Debit"});

    const errors = await validate(operation);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res, 400, errors, message);
    }

        const compte = await myDataSource.getRepository(Compte).findOne({
            where: {
                id: parseInt(req.body.compte),
            },
        });

        if (!compte) {
            return res.status(404).json({ message: "Compte introuvable" });
        }

        if (compte.soldeActuel <= req.body.montant) {
            return res.status(400).json({ message: "Solde insuffisant pour effectuer le décaissement" });
        }
        const nouveauSolde = compte.soldeActuel - req.body.montant;
        compte.soldeActuel = nouveauSolde;


    await myDataSource.manager.transaction(async (transactionalEntityManager) => {
        await transactionalEntityManager.getRepository(Operation).save(operation);
        await transactionalEntityManager.getRepository(Compte).save(compte);

    }).then(data => {
        const message = `L'opération a bien été créée.`;
        return success(res, 200, operation, message);
    }).catch(error=>{
        return res.status(500).json({ message: "Erreur lors de l'opération de décaissement" });
    })
};



export const getAllOperation = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Operation).find({
        relations:{
            compte:
            {
                client:true},
        }
    })
    .then((retour) => {
        const message = 'La liste des operations a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des operations n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getOperation = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Operation).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            compte:{
                client:true
            },
            client:true,
    },
    })
    .then(operation => {
        if(operation === null) {
          const message = `L'opération demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `L'opération a bien été trouvée.`
        return success(res,200, operation,message);
    })
    .catch(error => {
        const message = `L'opération n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateOperation = async (req: Request, res: Response) => {
    const operation = await myDataSource.getRepository(Operation).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
           
            compte:true,
            client:true,
     },
    }
    )
    if (!operation) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Cette opération  existe déjà')
    }
    myDataSource.getRepository(Operation).merge(operation,req.body);
    const errors = await validate(operation);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Operation).save(operation).then(operation => {
        const message = `L'opération${operation.id} a bien été modifiée.`
        return success(res,200,operation,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Cette opération existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Cette opération existe déjà')
        }
        const message = `L'opération n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteOperation = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Operation', parseInt(req.params.id));
    await myDataSource.getRepository(Operation)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
            compte:true,
            client:true,
   }
        })
    .then(operation => {        
        if(operation === null) {
          const message = `L'opération demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Cette opération est liée à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Cette opération est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Operation).softRemove(operation)
            .then(_ => {
                const message = `L'opération avec l'identifiant n°${operation.id} a bien été supprimée.`;
                return success(res,200, operation,message);
            })
        }
    }).catch(error => {
        const message = `L'opération n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
