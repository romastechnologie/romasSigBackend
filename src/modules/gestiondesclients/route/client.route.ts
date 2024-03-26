import * as express from 'express';
import { createClient, deleteClient, getAllClient, getClient, updateClient } from '../controller/client.controller';

export  const clientsRoutes =  (router: express.Router) => {
  router.post('/api/clients', createClient);
  router.get('/api/clients', getAllClient);
  router.get('/api/clients/:id', getClient);
  router.delete('/api/clients/:id',deleteClient);
  router.put('/api/clients/:id', updateClient);
};