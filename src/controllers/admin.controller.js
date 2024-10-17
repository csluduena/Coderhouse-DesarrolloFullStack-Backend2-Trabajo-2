import Product from '../dao/models/product.model.js';

export const getAdminStockPage = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.render('admin/stock', { categories, layout: 'main' });
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};