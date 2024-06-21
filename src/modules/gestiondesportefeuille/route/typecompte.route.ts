import * as express from 'express';
import { createTypeCompte, deleteTypeCompte, getAllTypeCompte, getTypeCompte, updateTypeCompte } from '../controller/typecompte.controller';

export  const typecomptesRoutes =  (router: express.Router) => {
  router.post('/api/typecomptes', createTypeCompte);
  router.get('/api/typecomptes', getAllTypeCompte);
  router.get('/api/typecomptes/:id', getTypeCompte);
  router.delete('/api/typecomptes/:id',deleteTypeCompte);
  router.put('/api/typecomptes/:id', updateTypeCompte);
};