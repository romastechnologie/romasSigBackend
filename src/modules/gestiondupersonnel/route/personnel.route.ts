import * as express from 'express';
import { createPersonnel, deletePersonnel, getAllPersonnel, getPersonnel, updatePersonnel } from '../controller/personnel.controller';

export  const personnelsRoutes =  (router: express.Router) => {
  router.post('/api/personnels', createPersonnel);
  router.get('/api/personnels', getAllPersonnel);
  router.get('/api/personnels/:id', getPersonnel);
  router.delete('/api/personnels/:id',deletePersonnel);
  router.put('/api/personnels/:id', updatePersonnel);
};