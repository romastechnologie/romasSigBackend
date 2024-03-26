import * as express from 'express';
import { createTransaction, deleteTransaction, getAllTransaction, getTransaction, updateTransaction } from '../controller/transaction.controller';

export  const transactionsRoutes =  (router: express.Router) => {
  router.post('/api/transactions', createTransaction);
  router.get('/api/transactions', getAllTransaction);
  router.get('/api/transactions/:id', getTransaction);
  router.delete('/api/transactions/:id',deleteTransaction);
  router.put('/api/transactions/:id', updateTransaction);
};