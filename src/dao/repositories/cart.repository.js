import Cart from '../models/cart.model.js';

export class CartRepository {
    async findByUserId(userId) {
        return await Cart.findOne({ user: userId }).populate('items.product');
    }

    async create(cartData) {
        const cart = new Cart(cartData);
        return await cart.save();
    }

    async update(id, updateData) {
        return await Cart.findByIdAndUpdate(id, updateData, { new: true });
    }

    async addItem(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async updateItem(cartId, itemId, quantity) {
        const cart = await Cart.findById(cartId);
        const item = cart.items.id(itemId);
        if (item) {
            item.quantity = quantity;
            await cart.save();
        }
        return cart;
    }

    async removeItem(cartId, itemId) {
        const cart = await Cart.findById(cartId);
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        cart.items = [];
        return await cart.save();
    }

    async findAll() {
        return await Cart.find().populate('items.product');
    }

    async delete(id) {
        return await Cart.findByIdAndDelete(id);
    }

    async addProduct(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        return await cart.save();
    }

    async removeProduct(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        return await cart.save();
    }
}
