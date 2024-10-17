import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { getCategories, getAdminStockPage } from '../controllers/admin.controller.js';

const router = Router();

router.use(isAuthenticated, isAdmin);

router.get('/stock', getAdminStockPage);
router.get('/categories', getCategories);

export default router;