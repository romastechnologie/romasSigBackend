import * as express from 'express';
import { createTypeDepense, deleteTypeDepense, getAllTypeDepense, getTypeDepense, updateTypeDepense } from '../controller/typedepense.controller';

export  const typedepensesRoutes =  (router: express.Router) => {
  router.post('/api/typedepenses', createTypeDepense);
  router.get('/api/typedepenses', getAllTypeDepense);
  router.get('/api/typedepenses/:id', getTypeDepense);
  router.delete('/api/typedepenses/:id',deleteTypeDepense);
  router.put('/api/typedepenses/:id', updateTypeDepense);
};