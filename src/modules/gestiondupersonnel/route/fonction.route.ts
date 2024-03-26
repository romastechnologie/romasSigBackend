import * as express from 'express';
import { createFonction, deleteFonction, getAllFonction, getFonction, updateFonction } from '../controller/fonction.controller';

export  const fonctionsRoutes =  (router: express.Router) => {
  router.post('/api/fonctions', createFonction);
  router.get('/api/fonctions', getAllFonction);
  router.get('/api/fonctions/:id', getFonction);
  router.delete('/api/fonctions/:id',deleteFonction);
  router.put('/api/fonctions/:id', updateFonction);
};