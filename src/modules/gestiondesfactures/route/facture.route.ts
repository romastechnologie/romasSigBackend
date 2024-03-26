import * as express from 'express';
import { createFacture, deleteFacture, getAllFacture, getFacture, updateFacture } from '../controller/facture.controller';

export  const facturesRoutes =  (router: express.Router) => {
  router.post('/api/factures', createFacture);
  router.get('/api/factures', getAllFacture);
  router.get('/api/factures/:id', getFacture);
  router.delete('/api/factures/:id',deleteFacture);
  router.put('/api/factures/:id', updateFacture);
};