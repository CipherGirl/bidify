import express from 'express';

import AuthController from '../controllers/AuthController.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/protected', isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You have access to this protected route',
  });
});
export const AuthRoutes = router;
