export class ProductDTO {
    constructor(product) {
        this.id = product._id;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.img = product.img;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.model = product.model;
        this.status = product.status;
        this.updatedAt = product.updatedAt;
    }
}