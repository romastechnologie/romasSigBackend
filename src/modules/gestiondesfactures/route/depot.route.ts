import * as express from 'express';
import { createDepot, deleteDepot, getAllDepot, getDepot, updateDepot } from '../controller/depot.controller';
export  const depotsRoutes =  (router: express.Router) => {
  router.post('/api/depots', createDepot);
  router.get('/api/depots', getAllDepot);
  router.get('/api/depots/:id', getDepot);
  router.delete('/api/depots/:id',deleteDepot);
  router.put('/api/depots/:id', updateDepot);
};