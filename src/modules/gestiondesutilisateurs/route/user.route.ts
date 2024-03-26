import * as express from 'express';
import { getAllUsers,updatePassword, deleteUser, updateUser, getUser, createUser, ChangerPasswordAdmin } from '../controller/user.controller';
import { checkPermission } from '../../../middlewares/auth.middleware';

export const userRoutes = (router: express.Router) => {
  router.get('/api/users', getAllUsers);
  router.post('/api/users',createUser);
  // router.get('/api/users/:id',checkPermission('ViewUser'), getUser);
  router.get('/api/users/:id', getUser);
  router.delete('/api/users/:id', deleteUser);
  router.put("/api/users/password/:id",updatePassword)
  router.put("/api/users/password/admin/:id",ChangerPasswordAdmin)
  router.put('/api/users/:id', updateUser);
};