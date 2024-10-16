import Product from '../models/product.model.js';
import { ProductDTO } from '../../dto/product.dto.js';

export class ProductRepository {
    async findAll(options = {}) {
        const products = await Product.paginate({}, options);
        return {
            ...products,
            docs: products.docs.map(product => new ProductDTO(product))
        };
    }

    async findById(id) {
        const product = await Product.findById(id);
        return product ? new ProductDTO(product) : null;
    }

    async create(productData) {
        const product = new Product(productData);
        await product.save();
        return new ProductDTO(product);
    }

    async update(id, updateData) {
        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return product ? new ProductDTO(product) : null;
    }

    async delete(id) {
        const product = await Product.findByIdAndDelete(id);
        return product ? new ProductDTO(product) : null;
    }
}
