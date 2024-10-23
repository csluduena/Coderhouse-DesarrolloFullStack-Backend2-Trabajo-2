// import { Router } from 'express';
// import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
// import { getCategories, getAdminStockPage } from '../controllers/admin.controller.js';
// import { updateStock, createCategory } from '../controllers/admin.api.controller.js';

// const router = Router();

// router.use(isAuthenticated, isAdmin);

// /**
//  * @swagger
//  * /admin/stock:
//  *   get:
//  *     summary: Get admin stock page
//  *     tags: [Admin]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved admin stock page
//  *       401:
//  *         description: Unauthorized access
//  *       403:
//  *         description: Forbidden - Not an admin
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/stock', getAdminStockPage, isAdmin);

// /**
//  * @swagger
//  * /admin/categories:
//  *   get:
//  *     summary: Get all categories
//  *     tags: [Admin]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved categories
//  *       401:
//  *         description: Unauthorized access
//  *       403:
//  *         description: Forbidden - Not an admin
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/categories', isAuthenticated, isAdmin, getCategories);

// // Ruta para actualizar el stock de un producto
// router.post('/stock/update', updateStock);

// // Ruta para crear una nueva categoría
// router.post('/categories/create', createCategory);

// export default router;

import { Router } from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import { getCategories, getAdminStockPage, updateStock, createCategory } from '../controllers/admin.controller.js';

const router = Router();

router.use(isAuthenticated, isAdmin);

/**
 * @swagger
 * /admin/stock/update:
 *   get:
 *     summary: Update stock
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved admin stock page
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Not an admin
 *       500:
 *         description: Internal server error
 */
router.get('/stock', isAdmin, getAdminStockPage);

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved categories
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Not an admin
 *       500:
 *         description: Internal server error
 */
// router.get('/categories', getCategories);

router.get('/categories', isAuthenticated, isAdmin, getCategories);

// Ruta para actualizar el stock de un producto
router.post('/stock/update', updateStock);

// Ruta para crear una nueva categoría
router.post('/categories/create', createCategory);

export default router;
