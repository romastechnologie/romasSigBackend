import * as express from 'express';
import { createAdresseLivraison, deleteAdresseLivraison, getAdresseLivraison, getAllAdresseLivraison, updateAdresseLivraison } from '../controller/adresselivraison.controller';

export  const adresselivraisonsRoutes =  (router: express.Router) => {
  router.post('/api/adresselivraisons', createAdresseLivraison);
  router.get('/api/adresselivraisons', getAllAdresseLivraison);
  router.get('/api/adresselivraisons/:id', getAdresseLivraison);
  router.delete('/api/adresselivraisons/:id',deleteAdresseLivraison);
  router.put('/api/adresselivraisons/:id', updateAdresseLivraison);
};