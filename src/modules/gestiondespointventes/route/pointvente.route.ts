import * as express from 'express';
import { createPointVente, deletePointVente, getAllPointVente, getPointVente, updatePointVente } from '../controller/pointvente.controller';


export  const pointventesRoutes =  (router: express.Router) => {
  router.post('/api/pointventes', createPointVente);
  router.get('/api/pointventes', getAllPointVente);
  router.get('/api/pointventes/:id', getPointVente);
  router.delete('/api/pointventes/:id',deletePointVente);
  router.put('/api/pointventes/:id', updatePointVente);
};