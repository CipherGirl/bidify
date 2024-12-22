import express from 'express';

import ItemController from '../controllers/ItemController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/all', ItemController.getAll);
router.post('/create', isAuthenticated, ItemController.create);
router.patch('/update/:id', isAuthenticated, ItemController.update);

export const ItemRoutes = router;
