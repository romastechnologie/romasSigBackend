import * as express from 'express';
import { createTaxe, deleteTaxe, getAllTaxe, getTaxe, updateTaxe } from '../controller/taxe.controller';

export  const taxesRoutes =  (router: express.Router) => {
  router.post('/api/taxes', createTaxe);
  router.get('/api/taxes', getAllTaxe);
  router.get('/api/taxes/:id', getTaxe);
  router.delete('/api/taxes/:id',deleteTaxe);
  router.put('/api/taxes/:id', updateTaxe);
};