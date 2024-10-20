import User from '../dao/models/user.model.js';
import Cart from '../dao/models/cart.model.js';
import Ticket from '../dao/models/ticket.model.js';
import ProductManager from '../dao/db/productManagerDb.js';
import CartManager from '../dao/db/cartManagerDb.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';
import { CategoryRepository } from '../dao/repositories/category.repository.js';
import Product from '../dao/models/product.model.js';

const productManager = new ProductManager();
const cartManager = new CartManager();
const categoryRepository = new CategoryRepository();

export const renderHomePage = async (req, res) => {
    try {
        const categories = await categoryRepository.findAll();
        const allProducts = await Product.find();
        const featuredProducts = getRandomProducts(allProducts, 10);

        //console.log('User in session:', res.locals.user);

        res.render('home', {
            user: res.locals.user,
            categories: categories,
            featuredProducts: featuredProducts
        });

        //console.log('User object:', res.locals.user);

    } catch (error) {
        console.error('Error al obtener categorías y productos:', error);
        res.status(500).render('error', { message: 'Error al cargar la página de inicio' });
    }
};

function getRandomProducts(products, count) {
    const shuffled = products.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export const renderSuccessPage = async (req, res) => {
    try {
        const ticketId = req.query.ticketId;
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(ERROR_CODES.NOT_FOUND).render('error', { message: 'Ticket no encontrado' });
        }

        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        const purchasedItems = cart.items.filter(item => item.product.stock >= item.quantity);
        const failedItems = cart.items.filter(item => item.product.stock < item.quantity);

        res.render('success', { ticket, purchasedItems, failedItems });
    } catch (error) {
        console.error('Error al renderizar la página de éxito:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.render('cart', { cartItems: [], isEmpty: true });
        }
        const cartItems = cart.items.map(item => ({
            _id: item._id,
            product: {
                _id: item.product._id,
                title: item.product.title,
                price: item.product.price,
                img: item.product.img,
            },
            quantity: item.quantity
        }));
        res.render('cart', { cartItems, isEmpty: false });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).render('error', { message: 'Error al cargar el carrito' });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(ERROR_CODES.UNAUTHORIZED).redirect('/login');
        }
        res.render('current-session', { user: req.user });
    } catch (error) {
        console.error('Error in getCurrentUser:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getProductDetails = async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.id);
        if (!product) {
            return res.status(ERROR_CODES.NOT_FOUND).render('error', { message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.render('productDetails', { product, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getProducts = async (req, res) => {
    try {
        if (!req.user) {
            // Si el usuario no está autenticado, redirigir al login
            return res.redirect('/login');
        }
        const page = parseInt(req.query.page) || 1;
        const limit = 3;
        const sort = req.query.sort || 'createdAt';
        const products = await productManager.getProducts(page, limit, sort);
        res.render('products', {
            products: products.docs,
            pagination: {
                page: products.page,
                totalPages: products.totalPages,
                hasNextPage: products.hasNextPage,
                hasPrevPage: products.hasPrevPage,
                nextPage: products.nextPage,
                prevPage: products.prevPage
            },
            user: req.user,
            sort: sort
        });
    } catch (error) {
        console.error(error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).render('error', { message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getUserProfile = async (req, res) => {
    res.render('profile', { user: req.user });
};

export const renderLoginPage = (req, res) => {
    res.render("login");
};

export const renderRegisterPage = (req, res) => {
    res.render("register");
};