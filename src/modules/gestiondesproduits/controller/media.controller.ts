import { myDataSource } from "../../../configs/data-source";
import { generateServerErrorCode, success, validateMessage } from "../../../configs/response";
import { Request, Response } from "express";
import { ValidationError, validate } from "class-validator";
import { Brackets } from "typeorm";
import { Media } from "../entity/Media";
import { checkRelationsOneToMany } from "../../../configs/checkRelationsOneToManyBeforDelete";



export const createMedia = async (req: Request, res: Response) => {
    const media = myDataSource.getRepository(Media).create(req.body);
    const errors = await validate(media)
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Media).save(media)
    .then(media => {
        const message = `Le média ${req.body.id} a bien été créé.`
        return success(res,201, media,message);
    })
    .catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce média  existe déjà.')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce média  existe déjà.')
        }
        const message = `Le média n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}

export const getAllMedia = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Media).find({
        relations:{
            
        }
    })
    .then((retour) => {
        const message = 'La liste des medias a bien été récupérée.';
        return success(res,200,{data:retour}, message);
    }).catch(error => {
        const message = `La liste des medias n'a pas pu être récupérée. Réessayez dans quelques instants.`
        //res.status(500).json({ message, data: error })
        return generateServerErrorCode(res,500,error,message)
    })
};

export const getMedia = async (req: Request, res: Response) => {
    await myDataSource.getRepository(Media).findOne({
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
    },
    })
    .then(media => {
        if(media === null) {
          const message = `Le média demandé n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message)
        }
        const message = `Le média a bien été trouvée.`
        return success(res,200, media,message);
    })
    .catch(error => {
        const message = `Le média n'a pas pu être récupérée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
};


export const updateMedia = async (req: Request, res: Response) => {
    const media = await myDataSource.getRepository(Media).findOne(
       { 
        where: {
            id: parseInt(req.params.id),
        },
        relations: {
            
        },
    }
    )
    if (!media) {
        return generateServerErrorCode(res,400,"L'id n'existe pas",'Ce média  existe déjà')
    }
    myDataSource.getRepository(Media).merge(media,req.body);
    const errors = await validate(media);
    if (errors.length > 0) {
        const message = validateMessage(errors);
        return generateServerErrorCode(res,400,errors,message)
    }
    await myDataSource.getRepository(Media).save(media).then(media => {
        const message = `Le média ${media.id} a bien été modifié.`
        return success(res,200,media,message);
    }).catch(error => {
        if(error instanceof ValidationError) {
            return generateServerErrorCode(res,400,error,'Ce média existe déjà')
        }
        if(error.code == "ER_DUP_ENTRY") {
            return generateServerErrorCode(res,400,error,'Ce média existe déjà')
        }
        const message = `Le média n'a pas pu être ajouté. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
        // res.status(500).json({ message, data: error }) 
    })
}

export const deleteMedia = async (req: Request, res: Response) => {
    const resultat = await checkRelationsOneToMany('Media', parseInt(req.params.id));
    await myDataSource.getRepository(Media)
    .findOne({
        where: {
            id: parseInt(req.params.id)
        },
        relations:{
           
        }
        })
    .then(media => {        
        if(media === null) {
          const message = `Le média demandée n'existe pas. Réessayez avec un autre identifiant.`
          return generateServerErrorCode(res,400,"L'id n'existe pas",message);
        }

        if(resultat){
            const message = `Ce média est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.`
            return generateServerErrorCode(res,400,"Ce média est lié à d'autres enregistrements. Vous ne pouvez pas le supprimer.",message);
        }else{
            myDataSource.getRepository(Media).softRemove(media)
            .then(_ => {
                const message = `Le média avec l'identifiant n°${media.id} a bien été supprimée.`;
                return success(res,200, media,message);
            })
        }
    }).catch(error => {
        const message = `Le média n'a pas pu être supprimée. Réessayez dans quelques instants.`
        return generateServerErrorCode(res,500,error,message)
    })
}
