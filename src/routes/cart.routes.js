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

/*
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzEwM2UxYTRkZWZiNTI2OTg1MDA5MTMiLCJmaXJzdF9uYW1lIjoiSm9obiIsImxhc3RfbmFtZSI6IkRvZSIsImVtYWlsIjoiM0Bsa2dsZS5jb20iLCJhZ2UiOjMwLCJyb2xlIjoidXNlciIsImNhcnQiOiI2NzEwM2UxYTRkZWZiNTI2OTg1MDA5MTUiLCJpYXQiOjE3MjkxMTc3MjIsImV4cCI6MTcyOTEyMTMyMn0.YDGasL5yY71IA6_f6OJQsz122O3RZpWdFwmLsxjIbOw

*/