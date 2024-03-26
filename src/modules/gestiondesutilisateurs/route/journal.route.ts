import * as express from 'express';
//import { checkPermission } from '../../../middlewares/auth.middleware';
import { getAllJournalConnexions, getAllJournalOperations } from '../controller/journal.controller';

export  const journalRoutes =  (router: express.Router) => {
  router.get('/api/journalConnexions', getAllJournalConnexions);
  router.get('/api/journalOperations', getAllJournalOperations);
};