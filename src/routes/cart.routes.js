import { Router } from 'express';
import { isAuthenticated, isUser } from '../middlewares/auth.middleware.js';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart, finalizePurchase, getALlCarts, deleteCart, addProductToCart, removeProductFromCart, getCartCount } from '../controllers/cart.controller.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', getCart);
router.post('/add', isAuthenticated, addToCart);
router.delete('/remove/:itemId', removeFromCart);
router.get('/count', isAuthenticated, getCartCount);
router.put('/update/:itemId', updateCartItem, isAuthenticated);
router.delete('/clear', clearCart);
router.post('/finalize', finalizePurchase);
router.get('/carts/:cid', isAuthenticated, getCart);
router.get('/:cid', getCart);
router.get('/', getALlCarts);
router.delete('/:cid', deleteCart); 
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);

export default router;