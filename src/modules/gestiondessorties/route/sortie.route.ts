import * as express from 'express';
import { createSortie, deleteSortie, getAllSortie, getSortie, updateSortie } from '../controller/sortie.controller';

export  const sortiesRoutes =  (router: express.Router) => {
  router.post('/api/sorties', createSortie);
  router.get('/api/sorties', getAllSortie);
  router.get('/api/sorties/:id', getSortie);
  router.delete('/api/sorties/:id',deleteSortie);
  router.put('/api/sorties/:id', updateSortie);
};