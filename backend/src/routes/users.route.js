import express from 'express';

import UserController from '../controllers/UserController.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', UserController.getAll);
router.post('/create', UserController.create);
router.get('/find-by-email', UserController.findByEmail);
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.get('/me', isAuthenticated, usersController.getCurrentUser);

export const UserRoutes = router;
