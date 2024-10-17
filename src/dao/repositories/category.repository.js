import { Category } from '../models/category.model.js';

export class CategoryRepository {
    async findByName(name) {
        try {
            return await Category.findOne({ name }).populate('products');
        } catch (error) {
            throw new Error('Error al buscar la categoría');
        }
    }

    async create(categoryData) {
        try {
            const newCategory = new Category(categoryData);
            return await newCategory.save();
        } catch (error) {
            throw new Error('Error al crear la categoría');
        }
    }

    async update(categoryId, categoryData) {
        try {
            return await Category.findByIdAndUpdate(categoryId, categoryData, { new: true });
        } catch (error) {
            throw new Error('Error al actualizar la categoría');
        }
    }
}
