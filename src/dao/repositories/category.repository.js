import Category from '../models/category.model.js';

export class CategoryRepository {
    async findByName(name) {
        try {
            return await Category.findOne({ name }).populate('products');
        } catch (error) {
            throw new Error('Error al buscar la categoría');
        }
    }

    async findAll() {
        try {
            return await Category.find().populate('products');
        } catch (error) {
            throw new Error('Error al obtener las categorías');
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
