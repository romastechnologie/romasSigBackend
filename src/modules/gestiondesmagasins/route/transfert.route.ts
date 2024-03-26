import * as express from 'express';
import { createTransfert, deleteTransfert, getAllTransfert, getTransfert, updateTransfert } from '../controller/transfert.controller';


export  const transfertsRoutes =  (router: express.Router) => {
  router.post('/api/transferts', createTransfert);
  router.get('/api/transferts', getAllTransfert);
  router.get('/api/transferts/:id', getTransfert);
  router.delete('/api/transferts/:id',deleteTransfert);
  router.put('/api/transferts/:id', updateTransfert);
};