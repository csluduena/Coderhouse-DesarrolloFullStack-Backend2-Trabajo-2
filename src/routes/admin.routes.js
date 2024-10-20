import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { getCategories, getAdminStockPage } from '../controllers/admin.controller.js';

const router = Router();

router.use(isAuthenticated, isAdmin);
router.get('/stock', getAdminStockPage, isAdmin, );
router.get('/categories', isAuthenticated, isAdmin , getCategories);

export default router;