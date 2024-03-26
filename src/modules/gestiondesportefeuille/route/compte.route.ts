import * as express from 'express';
import { createCompte, deleteCompte, getAllCompte, getCompte, updateCompte } from '../controller/compte.controller';

export  const comptesRoutes =  (router: express.Router) => {
  router.post('/api/comptes', createCompte);
  router.get('/api/comptes', getAllCompte);
  router.get('/api/comptes/:id', getCompte);
  router.delete('/api/comptes/:id',deleteCompte);
  router.put('/api/comptes/:id', updateCompte);
};