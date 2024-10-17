//! INFORMACION: 
//? En cada respuesta de error, se reemplazaron los mensajes de error y códigos de estado por los correspondientes de ERROR_CODES y ERROR_MESSAGES:
//? Se utilizó ERROR_CODES.NOT_FOUND y ERROR_MESSAGES.CART_NOT_FOUND para los casos donde no se encuentra el carrito.
//? Se utilizó ERROR_CODES.INTERNAL_SERVER_ERROR y ERROR_MESSAGES.SERVER_ERROR para manejar errores internos del servidor.

import { Router } from 'express';
import { isAuthenticated, isUser } from '../middlewares/auth.middleware.js';
import { getCart, addToCart, removeFromCart, updateCartItem, clearCart, finalizePurchase, getALlCarts, deleteCart, addProductToCart, removeProductFromCart } from '../controllers/cart.controller.js';

const router = Router();

router.use(isAuthenticated);

router.get('/', getCart);
router.get('/carts/:cid', isAuthenticated, getCart);
router.get('/:cid', getCart);
router.delete('/remove/:itemId', removeFromCart);
router.delete('/clear', clearCart);
router.post('/add', addToCart);
router.post('/finalize', isUser, finalizePurchase);
router.put('/update/:itemId', updateCartItem);

router.get('/', getALlCarts);
router.delete('/:cid', deleteCart); 
router.post('/:cid/product/:pid', addProductToCart);
router.delete('/:cid/products/:pid', removeProductFromCart);

export default router;