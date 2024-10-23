import { Router } from 'express';
import { isAuthenticated, isUser } from '../middlewares/auth.middleware.js';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart, finalizePurchase, finalizePurchaseAPI, getALlCarts, deleteCart, addProductToCart, removeProductFromCart, getCartCount } from '../controllers/cart.controller.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', getCart);

/**
 * @swagger
 * /api/carts/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item successfully added to cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.post('/add', isAuthenticated, addToCart);

/**
 * @swagger
 * /api/carts/remove/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item successfully removed from cart
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Internal server error
 */
router.delete('/remove/:itemId', removeFromCart);

/**
 * @swagger
 * /api/carts/count:
 *   get:
 *     summary: Get cart item count
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved cart item count
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.get('/count', isAuthenticated, getCartCount);

/**
 * @swagger
 * /api/carts/update/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item successfully updated
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Item not found in cart
 *       500:
 *         description: Internal server error
 */
router.put('/update/:itemId', updateCartItem, isAuthenticated);

/**
 * @swagger
 * /api/carts/clear:
 *   delete:
 *     summary: Clear all items from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart successfully cleared
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.delete('/clear', clearCart);

/**
 * @swagger
 * /api/carts/finalize:
 *   post:
 *     summary: Finalize purchase and create order
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase finalized successfully
 *       400:
 *         description: Invalid cart state or insufficient stock
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */
router.post('/finalize', finalizePurchase);

/**
 * @swagger
 * /api/carts/{cId}:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved cart
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.get('/carts/:cid', isAuthenticated, getCart);

router.post('/api/carts/finalize', isAuthenticated, finalizePurchaseAPI);


router.get('/:cid', getCart);
router.get('/', getALlCarts);
router.delete('/:cid', deleteCart); 
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);

export default router;