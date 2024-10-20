import { ProductDTO } from '../../dto/product.dto.js';
import Product from '../models/product.model.js';

export class ProductRepository {
    async findById(id) {
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            console.error('Error in ProductRepository.findById:', error);
            throw error;
        }
    }

    async findAll(filter = {}, options = {}) {
        const { page, limit, sort } = options;

        let query = Product.find(filter);

        if (sort) {
            query = query.sort(sort);
        }

        // Si se especifican page y limit, realizar la paginación
        if (page && limit) {
            const products = await query.skip((page - 1) * limit).limit(limit);
            const total = await Product.countDocuments(filter);

            return {
                products: products.map(product => new ProductDTO(product)),
                total,
                page,
                limit,
            };
        } else {
            // Si no se especifican page y limit, devolver todos los productos sin paginación
            const products = await query.exec();
            return products.map(product => new ProductDTO(product)); 
        }
    }

    async findByIds(ids, options = {}) {
        const { page = 1, limit = 10, sort = {} } = options;
        // Buscar productos que tengan un _id que coincida con cualquiera de los ids proporcionados
        const products = await Product.paginate({ _id: { $in: ids } }, { page, limit, sort });
        return {
            ...products,
            docs: products.docs.map(product => new ProductDTO(product))  // Mapeamos los productos a DTOs
        };
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
