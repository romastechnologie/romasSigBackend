import * as express from 'express';
import { createModePaiement, deleteModePaiement, getAllModePaiement, getModePaiement, updateModePaiement } from '../controller/modepaiement.contrller';

export  const modepaiementsRoutes =  (router: express.Router) => {
  router.post('/api/modepaiements', createModePaiement);
  router.get('/api/modepaiements', getAllModePaiement);
  router.get('/api/modepaiements/:id', getModePaiement);
  router.delete('/api/modepaiements/:id',deleteModePaiement);
  router.put('/api/modepaiements/:id', updateModePaiement);
};