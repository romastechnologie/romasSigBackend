import * as express from 'express';
import { createCommandeClient, deleteCommandeClient, getAllCommandeClient, getCommandeClient, updateCommandeClient } from '../controller/commandeclient.controller';

export  const commandeClientsRoutes =  (router: express.Router) => {
  router.post('/api/commandeClients', createCommandeClient);
  router.get('/api/commandeClients', getAllCommandeClient);
  router.get('/api/commandeClients/:id', getCommandeClient);
  router.delete('/api/commandeClients/:id',deleteCommandeClient);
  router.put('/api/commandeClients/:id', updateCommandeClient);
};