import * as express from 'express';
import { createBanque, deleteBanque, getAllBanque, getBanque, updateBanque } from '../controller/banque.controller';

export  const banquesRoutes =  (router: express.Router) => {
  router.post('/api/banques', createBanque);
  router.get('/api/banques', getAllBanque);
  router.get('/api/banques/:id', getBanque);
  router.delete('/api/banques/:id',deleteBanque);
  router.put('/api/banques/:id', updateBanque);
};