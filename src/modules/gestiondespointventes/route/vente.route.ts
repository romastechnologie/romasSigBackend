import * as express from 'express';
import { createVente, deleteVente, getAllVente, getVente, updateVente } from '../controller/vente.controller';


export  const ventesRoutes =  (router: express.Router) => {
  router.post('/api/ventes', createVente);
  router.get('/api/ventes', getAllVente);
  router.get('/api/ventes/:id', getVente);
  router.delete('/api/ventes/:id',deleteVente);
  router.put('/api/ventes/:id', updateVente);
};