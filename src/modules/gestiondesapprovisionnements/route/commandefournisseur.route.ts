import * as express from 'express';
import { createCommandeFournisseur, deleteCommandeFournisseur, getAllCommandeFournisseur, getCommandeFournisseur, updateCommandeFournisseur } from '../controller/commandefournisseur.controller';

export  const commandeFournisseursRoutes =  (router: express.Router) => {
  router.post('/api/commandeFournisseurs', createCommandeFournisseur);
  router.get('/api/commandeFournisseurs', getAllCommandeFournisseur);
  router.get('/api/commandeFournisseurs/:id', getCommandeFournisseur);
  router.delete('/api/commandeFournisseurs/:id',deleteCommandeFournisseur);
  router.put('/api/commandeFournisseurs/:id', updateCommandeFournisseur);
};