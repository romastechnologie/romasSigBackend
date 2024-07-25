import * as express from 'express';
import { createElement, deleteElement, getAllElement, getElement, updateElement } from '../controller/element.controller';

export  const elementsRoutes =  (router: express.Router) => {
  router.post('/api/elements', createElement);
  router.get('/api/elements', getAllElement);
  router.get('/api/elements/:id', getElement);
  router.delete('/api/elements/:id',deleteElement);
  router.put('/api/elements/:id', updateElement);
};