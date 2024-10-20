import Cart from '../dao/models/cart.model.js';

export async function repairCarts() {
    try {
        const carts = await Cart.find({});
        for (let cart of carts) {
            if (!Array.isArray(cart.items)) {
                cart.items = [];
                await cart.save();
                console.log(`Repaired cart ${cart._id}`);
            }
        }
        //console.log('Cart repair process completed');
    } catch (error) {
        //console.error('Error repairing carts:', error);
    }
}