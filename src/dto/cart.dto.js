export class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.userId = cart.user;
        this.items = cart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));
        this.total = this.calculateTotal();
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}