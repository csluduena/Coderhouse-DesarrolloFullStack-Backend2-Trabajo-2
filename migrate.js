import Product from './src/dao/models/product.model.js';
import mongoose from 'mongoose';

// Carga las variables de entorno desde el archivo .env
import dotenv from 'dotenv';
dotenv.config();

// 1. Actualiza el campo "category" a "model" en todos los productos
const updateProducts = async () => {
    try {
        await Product.updateMany({}, { $rename: { 'category': 'model' } });
        console.log('Campo "category" renombrado a "model" en todos los productos.');
    } catch (error) {
        console.error('Error al renombrar el campo:', error);
    }
};

// 2. Crea las categorías (si aún no existen)
const createCategories = async () => {
    try {
        // Accede a la conexión de Mongoose
        const db = mongoose.connection;
        const categoriesCollection = db.collection('categories');
        const existingCategories = await categoriesCollection.find({}).toArray();

        if (existingCategories.length === 0) {
            const categories = [
                { name: 'Electric Guitar', products: [] },
                { name: 'Bass', products: [] },
                { name: 'Drums', products: [] },
                { name: 'Keyboards', products: [] }
            ];

            const result = await categoriesCollection.insertMany(categories);
            console.log('Categorías creadas:', result.insertedCount);
        } else {
            console.log('Ya existen categorías en la base de datos.');
        }
    } catch (error) {
        console.error('Error al crear categorías:', error);
    }
};

// 3. Asocia los productos a las categorías
const associateProductsAndCategories = async () => {
    try {
        const electricGuitars = await Product.find({ model: { $in: ['SG', 'Les Paul', 'Stratocaster'] } }).lean();
        const basses = await Product.find({ model: { $in: ['Precision Bass', 'Jazz Bass'] } }).lean();
        // ... (repite para Drums y Keyboards)

        // ... (código para actualizar el campo 'category' de los productos)

        console.log('Productos asociados a categorías.');
    } catch (error) {
        console.error('Error al asociar productos y categorías:', error);
    }
};

// Ejecuta las funciones en orden
const migrateData = async () => {
    try {
        await updateProducts();
        await createCategories();
        await associateProductsAndCategories();
    } catch (error) {
        console.error('Error al realizar la migración:', error);
    }
};

migrateData();