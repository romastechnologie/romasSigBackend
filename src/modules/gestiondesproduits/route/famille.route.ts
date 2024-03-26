import * as express from 'express';
import { createFamille, deleteFamille, getAllFamille, getFamille, updateFamille } from '../controller/famille.controller';

export  const famillesRoutes =  (router: express.Router) => {
  router.post('/api/familles', createFamille);
  router.get('/api/familles', getAllFamille);
  router.get('/api/familles/:id', getFamille);
  router.delete('/api/familles/:id',deleteFamille);
  router.put('/api/familles/:id', updateFamille);
};