import * as express from 'express';
import { createTypeOperation, deleteTypeOperation, getAllTypeOperation, getTypeOperation, updateTypeOperation } from '../controller/typeoperation.controller';

export  const typeoperationsRoutes =  (router: express.Router) => {
  router.post('/api/typeoperations', createTypeOperation);
  router.get('/api/typeoperations', getAllTypeOperation);
  router.get('/api/typeoperations/:id', getTypeOperation);
  router.delete('/api/typeoperations/:id',deleteTypeOperation);
  router.put('/api/typeoperations/:id', updateTypeOperation);
};