import * as express from 'express';
import { createProduit, deleteProduit, getAllProduit, getProduit, updateProduit } from '../entity/controller/produit.controller';

export  const produitsRoutes =  (router: express.Router) => {
  router.post('/api/produits', createProduit);
  router.get('/api/produits', getAllProduit);
  router.get('/api/produits/:id', getProduit);
  router.delete('/api/produits/:id',deleteProduit);
  router.put('/api/produits/:id', updateProduit);
};