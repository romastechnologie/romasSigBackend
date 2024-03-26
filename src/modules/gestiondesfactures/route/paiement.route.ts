import * as express from 'express';
import { createPaiement, deletePaiement, getAllPaiement, getPaiement, updatePaiement } from '../controller/paiement.controller';

export  const paiementsRoutes =  (router: express.Router) => {
  router.post('/api/paiements', createPaiement);
  router.get('/api/paiements', getAllPaiement);
  router.get('/api/paiements/:id', getPaiement);
  router.delete('/api/paiements/:id',deletePaiement);
  router.put('/api/paiements/:id', updatePaiement);
};