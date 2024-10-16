export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.price = product.price;
        this.description = product.description;
        this.category = product.category;
        this.stock = product.stock;
        this.img = product.img;
    }
}