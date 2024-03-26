import * as express from 'express';
import { createLivraison, deleteLivraison, getAllLivraison, getLivraison, updateLivraison } from '../controller/livraison.controller';

export  const livraisonsRoutes =  (router: express.Router) => {
  router.post('/api/livraisons', createLivraison);
  router.get('/api/livraisons', getAllLivraison);
  router.get('/api/livraisons/:id', getLivraison);
  router.delete('/api/livraisons/:id',deleteLivraison);
  router.put('/api/livraisons/:id', updateLivraison);
};