import * as express from 'express';
import { createMedia, deleteMedia, getAllMedia, getMedia, updateMedia } from '../controller/media.controller';

export  const mediasRoutes =  (router: express.Router) => {
  router.post('/api/medias', createMedia);
  router.get('/api/medias', getAllMedia);
  router.get('/api/medias/:id', getMedia);
  router.delete('/api/medias/:id',deleteMedia);
  router.put('/api/medias/:id', updateMedia);
};