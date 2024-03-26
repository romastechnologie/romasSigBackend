import * as express from 'express';
import { createFournisseur, deleteFournisseur, getAllFournisseur, getFournisseur, updateFournisseur } from '../controller/fournisseur.controller';

export  const fournisseursRoutes =  (router: express.Router) => {
  router.post('/api/fournisseurs', createFournisseur);
  router.get('/api/fournisseurs', getAllFournisseur);
  router.get('/api/fournisseurs/:id', getFournisseur);
  router.delete('/api/fournisseurs/:id',deleteFournisseur);
  router.put('/api/fournisseurs/:id', updateFournisseur);
};