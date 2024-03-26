import * as express from 'express';
import { createSociete, deleteSociete, getAllSociete, getSociete, updateSociete } from '../controller/societe.controller';

export  const societesRoutes =  (router: express.Router) => {
  router.post('/api/societes', createSociete);
  router.get('/api/societes', getAllSociete);
  router.get('/api/societes/:id', getSociete);
  router.delete('/api/societes/:id',deleteSociete);
  router.put('/api/societes/:id', updateSociete);
};