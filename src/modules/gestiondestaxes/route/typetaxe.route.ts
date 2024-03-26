import * as express from 'express';
import { createTypeTaxe, deleteTypeTaxe, getAllTypeTaxe, getTypeTaxe, updateTypeTaxe } from '../controller/typetaxe.controller';

export  const typetaxesRoutes =  (router: express.Router) => {
  router.post('/api/typetaxes', createTypeTaxe);
  router.get('/api/typetaxes', getAllTypeTaxe);
  router.get('/api/typetaxes/:id', getTypeTaxe);
  router.delete('/api/typetaxes/:id',deleteTypeTaxe);
  router.put('/api/typetaxes/:id', updateTypeTaxe);
};