import Product from '../dao/models/product.model.js';

// Lógica para renderizar la página de stock del administrador
export const getAdminStockPage = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.render('admin/stock', { categories, layout: 'main' });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Lógica para obtener las categorías (API)
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');

        if (categories.length === 0) {
            return res.status(404).json({ message: 'No categories found.' });
        }

        res.json({ categories });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Lógica para actualizar el stock de un producto (API)
export const updateStock = async (req, res) => {
    try {
        const { productId, newStock } = req.body;

        if (!productId || newStock === undefined) {
            return res.status(400).json({ message: 'Product ID and new stock are required.' });
        }

        // Actualizar solo el campo stock
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { stock: newStock },
            { new: true, runValidators: true } // runValidators asegura que se cumplan las validaciones del modelo
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Stock updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Error updating stock:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Lógica para crear una nueva categoría (API)
export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = { category: name };x
        // Aquí agregarías la lógica para crear la nueva categoría en la base de datos
        // Ejemplo: await Category.create(newCategory);
        res.status(201).json({ message: 'Categoría creada exitosamente' });
    } catch (error) {
        console.error('Error al crear la categoría:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
