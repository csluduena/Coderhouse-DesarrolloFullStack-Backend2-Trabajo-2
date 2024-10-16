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
        res.status(201).json(cart);
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
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
        res.json({ message: 'Item eliminado del carrito', cart });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

// export const updateCartItem = async (req, res) => {
//     const { itemId } = req.params;
//     const { quantity } = req.body;
//     try {
//         const cart = await cartRepository.findByUserId(req.user.userId);
//         if (!cart) {
//             return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
//         }
//         const updatedCart = await cartRepository.update(cart._id, {
//             $set: { "items.$[elem].quantity": quantity }
//         }, { 
//             arrayFilters: [{ "elem._id": itemId }]
//         });
//         res.json(updatedCart);
//     } catch (error) {
//         res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
//     }
// };

export const removeProductFromCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartRepository.removeProduct(cid, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
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
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        await cartRepository.delete(cid);
        res.status(200).json({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getALlCarts = async (req, res) => {
    try {
        const carts = await cartRepository.findAll();
        res.status(200).json(carts);
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const updateCartItem = async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Asegúrate de que el ítem existe antes de actualizar la cantidad
        const updatedCart = await cartRepository.updateItem(cart._id, itemId, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar cantidad del ítem:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.CART_NOT_FOUND });
        }
        await cartRepository.clearCart(cart._id);
        res.json({ message: 'Carrito vaciado con éxito' });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const finalizePurchase = async (req, res) => {
    try {
        const cart = await cartRepository.findByUserId(req.user.userId);
        if (!cart || cart.items.length === 0) {
            return res.status(ERROR_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.EMPTY_CART });
        }

        let totalAmount = 0;
        const purchasedItems = [];
        const failedItems = [];

        for (const item of cart.items) {
            const product = await productRepository.findById(item.product);
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productRepository.update(product._id, { stock: product.stock });
                purchasedItems.push(item);
                totalAmount += product.price * item.quantity;
            } else {
                failedItems.push(item);
            }
        }

        if (purchasedItems.length > 0) {
            const ticket = await ticketRepository.create({
                code: generateUniqueCode(),
                amount: totalAmount,
                purchaser: req.user.email
            });

            await cartRepository.update(cart._id, { items: failedItems });

            res.status(200).json({
                message: 'Compra finalizada con éxito',
                ticket: ticket,
                failedItems: failedItems
            });
        } else {
            res.status(ERROR_CODES.BAD_REQUEST).json({
                message: ERROR_MESSAGES.INSUFFICIENT_STOCK,
                failedItems: failedItems
            });
        }
    } catch (error) {
        console.error('Error al finalizar la compra:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};