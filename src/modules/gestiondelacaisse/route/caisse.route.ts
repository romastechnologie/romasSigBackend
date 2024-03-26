import * as express from 'express';
import { createCaisse, deleteCaisse, getAllCaisse, getCaisse, updateCaisse } from '../controller/caisse.controller';

export  const caissesRoutes =  (router: express.Router) => {
  router.post('/api/caisses', createCaisse);
  router.get('/api/caisses', getAllCaisse);
  router.get('/api/caisses/:id', getCaisse);
  router.delete('/api/caisses/:id',deleteCaisse);
  router.put('/api/caisses/:id', updateCaisse);
};