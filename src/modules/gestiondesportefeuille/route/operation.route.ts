import * as express from 'express';
import { createOperation, decaissementOperation, deleteOperation, encaissementOperation, getAllOperation, getOperation, updateOperation } from '../controller/operation.controller';

export  const operationsRoutes =  (router: express.Router) => {
  router.post('/api/operations', createOperation);
  router.get('/api/operations', getAllOperation);
  router.post('/api/encaissements', encaissementOperation);
  router.post('/api/decaissements', decaissementOperation);
  router.get('/api/operations/:id', getOperation);
  router.delete('/api/operations/:id',deleteOperation);
  router.put('/api/operations/:id', updateOperation);
  
};