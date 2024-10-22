import { CartRepository } from '../dao/repositories/cart.repository.js';
import { ProductRepository } from '../dao/repositories/product.repository.js';
import { TicketRepository } from '../dao/repositories/ticket.repository.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';
import { generateUniqueCode } from '../utils/util.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

export const getCart = async (req, res) => {
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            cart = await cartRepository.create({ user: req.user.userId, items: [] });
        }
        await cartRepository.addItem(cart._id, productId, quantity);
        res.status(201).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        await cartRepository.removeItem(cart._id, itemId);
        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const updateCartItem = async (req, res) => {
    //console.log("URL:", req.url);  // Agregar esta línea
    const { itemId } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        const updatedCart = await cartRepository.updateItem(cart._id, itemId, quantity);
        res.json(updatedCart);
    } catch (error) {
        //console.error('Error in updateCartItem:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        await cartRepository.clearCart(cart._id);
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error in clearCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getALlCarts = async (req, res) => {
    try {
        const carts = await cartRepository.findAll();
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error in getAllCarts:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getCartCount = async (req, res) => {
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        const count = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        res.json({ count });
    } catch (error) {
        console.error('Error in getCartCount:', error);
        res.status(500).json({ message: 'Error getting cart count' });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        await cartRepository.delete(cid);
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error in deleteCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartRepository.addProduct(cid, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error in addProductToCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartRepository.removeProduct(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        console.error('Error in removeProductFromCart:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const finalizePurchase = async (req, res) => {
    const productRepo = new ProductRepository();
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);

        if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
            return res.status(ERROR_CODES.BAD_REQUEST).json({ message: 'El carrito está vacío o no es válido' });
        }

        let totalAmount = 0;
        const purchasedItems = [];
        const failedItems = [];

        for (const item of cart.items) {
            if (!item.product || !item.quantity) {
                console.error('Invalid item in cart:', item);
                continue;
            }

            try {
                const product = await productRepo.findById(item.product._id);
                if (!product) {
                    console.error('Product not found:', item.product._id);
                    failedItems.push(item);
                    continue;
                }

                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await productRepository.update(product._id, product);
                    purchasedItems.push(item);
                    totalAmount += product.price * item.quantity;
                } else {
                    failedItems.push(item);
                }
            } catch (error) {
                console.error('Error processing product:', error);
                failedItems.push(item);
            }
        }

        if (purchasedItems.length > 0) {
            const ticket = await ticketRepository.create({
                code: generateUniqueCode(),
                amount: totalAmount,
                purchaser: req.user.email
            });

            // Update the cart to remove purchased items
            cart.items = failedItems;
            await cartRepository.update(cart._id, cart);

            res.status(200).json({
                message: 'Compra finalizada con éxito',
                ticket: ticket,
                purchasedItems: purchasedItems,
                failedItems: failedItems
            });
        } else {
            res.status(ERROR_CODES.BAD_REQUEST).json({
                message: ERROR_MESSAGES.INSUFFICIENT_STOCK,
                failedItems: failedItems
            });
        }
    } catch (error) {
        console.error('Error in finalizePurchase:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

