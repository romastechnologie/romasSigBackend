import * as express from 'express';
import { createDepense, deleteDepense, getAllDepense, getDepense, updateDepense } from '../controller/depense.controller';

export  const depensesRoutes =  (router: express.Router) => {
  router.post('/api/depenses', createDepense);
  router.get('/api/depenses', getAllDepense);
  router.get('/api/depenses/:id', getDepense);
  router.delete('/api/depenses/:id',deleteDepense);
  router.put('/api/depenses/:id', updateDepense);
};