import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories  } from '../controllers/product.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/categories', getCategories);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items to return
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 *       500:
 *         description: Internal server error
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{pid}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved product
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get("/:pid", getProductById);

/**
 * @swagger
 * /api/products/{pid}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.put("/:pid", isAuthenticated, isAdmin, updateProduct);

/**
 * @swagger
 * /api/products/{pid}:
 *   delete:
 *     summary: Delete a product from Stock
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden - Not an admin
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:pid", isAuthenticated, isAdmin, deleteProduct);

router.post("/", isAuthenticated, isAdmin, createProduct);

export default router;