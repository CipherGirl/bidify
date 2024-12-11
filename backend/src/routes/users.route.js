import express from 'express';

import usersController from '../controllers/users.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', usersController.createUser);
router.post('/login', usersController.loginUser);
router.get('/me', isAuthenticated, usersController.getCurrentUser);

export const UserRoutes = router;