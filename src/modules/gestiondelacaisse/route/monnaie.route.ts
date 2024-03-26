import * as express from 'express';
import { createMonnaie, deleteMonnaie, getAllMonnaie, getMonnaie, updateMonnaie} from '../controller/monnaie.controller';

export  const monnaiesRoutes =  (router: express.Router) => {
  router.post('/api/monnaies', createMonnaie);
  router.get('/api/monnaies', getAllMonnaie);
  router.get('/api/monnaies/:id', getMonnaie);
  router.delete('/api/monnaies/:id',deleteMonnaie);
  router.put('/api/monnaies/:id', updateMonnaie);
};