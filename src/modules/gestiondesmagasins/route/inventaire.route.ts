import * as express from 'express';
import { createInventaire, deleteInventaire, getAllInventaire, getInventaire, updateInventaire } from '../controller/inventaire.controller';


export  const inventairesRoutes =  (router: express.Router) => {
  router.post('/api/inventaires', createInventaire);
  router.get('/api/inventaires', getAllInventaire);
  router.get('/api/inventaires/:id', getInventaire);
  router.delete('/api/inventaires/:id',deleteInventaire);
  router.put('/api/inventaires/:id', updateInventaire);
};