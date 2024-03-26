import * as express from 'express';
import { createConditionnement, deleteConditionnement, getAllConditionnement, getConditionnement, updateConditionnement } from '../controller/conditionnement.controller';

export  const conditionnementsRoutes =  (router: express.Router) => {
  router.post('/api/conditionnements', createConditionnement);
  router.get('/api/conditionnements', getAllConditionnement);
  router.get('/api/conditionnements/:id', getConditionnement);
  router.delete('/api/conditionnements/:id',deleteConditionnement);
  router.put('/api/conditionnements/:id', updateConditionnement);
};