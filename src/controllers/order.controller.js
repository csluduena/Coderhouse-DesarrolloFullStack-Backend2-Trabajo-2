import { CartRepository } from '../dao/repositories/cart.repository.js';
import { ProductRepository } from '../dao/repositories/product.repository.js';
import { TicketRepository } from '../dao/repositories/ticket.repository.js';
import { generateUniqueCode } from '../utils/util.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';
import Order from '../dao/models/order.model.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartRepository.findByUserId(userId);

        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(ERROR_CODES.BAD_REQUEST).json({ message: ERROR_MESSAGES.INVALID_QUANTITY });
        }

        let totalAmount = 0;
        const orderItems = [];
        const failedItems = [];

        for (const item of cart.items) {
            const product = await productRepository.findById(item.product);
            if (product && product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await productRepository.update(product._id, product);
                orderItems.push({
                    product: item.product,
                    quantity: item.quantity,
                    price: product.price
                });
                totalAmount += product.price * item.quantity;
            } else {
                failedItems.push(item);
            }
        }

        if (orderItems.length > 0) {
            const code = generateUniqueCode();
            const newOrder = new Order({
                user: userId,
                code,
                items: orderItems,
                total: totalAmount
            });

            await newOrder.save();

            const ticket = await ticketRepository.create({
                code,
                amount: totalAmount,
                purchaser: req.user.email
            });

            // Clear the cart, keeping failed items
            await cartRepository.update(cart._id, { items: failedItems });

            res.status(201).json({
                message: 'Order created successfully',
                order: newOrder,
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
        console.error('Error in createOrder:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error in getOrders:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
        if (!order) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ message: ERROR_MESSAGES.NOT_FOUND });
        }
        res.json(order);
    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};