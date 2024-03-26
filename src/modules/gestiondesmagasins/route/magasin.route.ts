import * as express from 'express';
import { createMagasin, deleteMagasin, getAllMagasin, getMagasin, updateMagasin } from '../controller/magasin.controller';

export  const magasinsRoutes =  (router: express.Router) => {
  router.post('/api/magasins', createMagasin);
  router.get('/api/magasins', getAllMagasin);
  router.get('/api/magasins/:id', getMagasin);
  router.delete('/api/magasins/:id',deleteMagasin);
  router.put('/api/magasins/:id', updateMagasin);
};