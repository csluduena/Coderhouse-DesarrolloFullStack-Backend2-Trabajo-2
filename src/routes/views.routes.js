import { Router } from 'express';
import { isAuthenticated, checkUserSession } from '../middlewares/auth.middleware.js';
import { getCart, getProductDetails, getProducts, getUserProfile, renderLoginPage, renderRegisterPage, renderHomePage, getCurrentUser, renderSuccessPage } from '../controllers/view.controller.js';

const router = Router();

// Ruta para la página de inicio
router.get('/', renderHomePage);

// Ruta para la página de home
router.get('/home', (req, res) => {
    const user = req.user || null; // Asegúrate de que el usuario esté en la sesión
    res.render('home', { featuredProducts: yourFeaturedProducts, user });
});

// Otras rutas
router.get('/current', isAuthenticated, getCurrentUser);
router.get('/carts/:cid', isAuthenticated, getCart);
router.get('/products/:id', isAuthenticated, getProductDetails);
router.get('/products', isAuthenticated, getProducts);
router.get('/cart', isAuthenticated, getCart);
router.get('/profile', isAuthenticated, getUserProfile);
router.get('/login', checkUserSession, renderLoginPage);
router.get('/register', checkUserSession, renderRegisterPage);
router.get('/success', isAuthenticated, renderSuccessPage);

export default router;