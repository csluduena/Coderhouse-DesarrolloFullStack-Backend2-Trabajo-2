import { ProductRepository } from '../dao/repositories/product.repository.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';
import { CategoryRepository } from '../dao/repositories/category.repository.js';

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryRepository.getAllCategories();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query; // Extraer también page y limit
        let filter = {};

        if (category) {
            filter.category = category;
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const { products, total } = await productRepository.findAll(filter, options);

        res.json({
            total,
            page: options.page,
            limit: options.limit,
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

// Obtener detalles de un producto específico por su ID
export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productRepository.findById(pid);
        if (!product) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ status: "error", message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.status(200).json(product); // Cambiar de render a json
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

// Crear un nuevo producto
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, img, code, stock, category, brand, model } = req.body;

        // Validación de campos requeridos
        if (!title || !description || !price || !img || !code || !stock || !category || !brand || !model) {
            return res.status(400).json({ status: "error", message: "Todos los campos son obligatorios" });
        }

        const newProduct = await productRepository.create({ title, description, price, img, code, stock, category, brand, model });
        res.status(201).json({ status: "success", product: newProduct });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

// Actualizar un producto existente
export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productRepository.update(pid, req.body);
        if (!updatedProduct) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ status: "error", message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.json({ status: "success", message: "Producto actualizado correctamente", product: updatedProduct });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productRepository.delete(pid);
        if (!deletedProduct) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ status: "error", message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.json({ status: "success", message: "Producto eliminado correctamente", product: deletedProduct });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};
