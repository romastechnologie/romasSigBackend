import * as express from 'express';
import { createApprovisionnement, deleteApprovisionnement, getAllApprovisionnement, getApprovisionnement, updateApprovisionnement } from '../controller/aprovisionnement.controller';

export  const approvisionnementsRoutes =  (router: express.Router) => {
  router.post('/api/approvisionnements', createApprovisionnement);
  router.get('/api/approvisionnements', getAllApprovisionnement);
  router.get('/api/approvisionnements/:id', getApprovisionnement);
  router.delete('/api/approvisionnements/:id',deleteApprovisionnement);
  router.put('/api/approvisionnements/:id', updateApprovisionnement);
};