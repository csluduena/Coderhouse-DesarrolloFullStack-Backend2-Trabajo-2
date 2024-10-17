import { ProductRepository } from '../dao/repositories/product.repository.js';
import { CategoryRepository } from '../dao/repositories/category.repository.js';  // Importamos el CategoryRepository
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

const productRepository = new ProductRepository();
const categoryRepository = new CategoryRepository();  // Inicializamos el repositorio de categorías


export const getProducts = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    const querySort = req.query.sort || "defa";
    let sort = {};
    const category = req.query.category;

    switch (querySort) {
        case "price_asc":
            sort = { price: 1 };
            break;
        case "price_desc":
            sort = { price: -1 };
            break;
        case "alpha_asc":
            sort = { title: 1 };
            break;
        case "alpha_desc":
            sort = { title: -1 };
            break;
        case "defa":
            sort = { createdAt: 1 };
            break;
        default:
            break;
    }

    try {
        const query = category ? { category } : {};
        const result = await productRepository.findAll({ page, limit, sort, query });

        res.status(200).json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${querySort}${category ? `&category=${category}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${querySort}${category ? `&category=${category}` : ''}` : null
        });
    } catch (error) {
        console.error('Error in getProducts:', error);
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const getProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await productRepository.findById(pid);
        if (!product) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ status: "error", message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.status(200).json({ status: "success", product });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

// Función actualizada para crear producto y actualizar la categoría
export const createProduct = async (req, res) => {
    try {
        const { title, description, price, img, code, stock, category } = req.body;

        // 1. Crear el producto
        const newProduct = await productRepository.create({ title, description, price, img, code, stock, category });

        // Asegúrate de que todos los datos requeridos están presentes
        if (!title || !description || !price || !img || !code || !stock || !category) {
            return res.status(400).json({ status: "error", message: "Faltan datos requeridos" });
        }

        // 2. Buscar la categoría correspondiente o crear una nueva si no existe
        let categoryObj = await categoryRepository.findByName(category);

        if (categoryObj) {
            // Si la categoría existe, agregar el producto a su lista
            categoryObj.products.push(newProduct._id);
            await categoryRepository.update(categoryObj._id, categoryObj);
        } else {
            // Si la categoría no existe, crear una nueva
            const newCategory = {
                name: category,
                products: [newProduct._id]
            };
            await categoryRepository.create(newCategory);
        }

        res.status(201).json({ status: "success", message: "Producto creado y categoría actualizada", product: newProduct });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const updateProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const updatedProduct = await productRepository.update(pid, req.body);
        if (!updatedProduct) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ status: "error", message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.json({ status: "success", message: "Producto actualizado exitosamente", product: updatedProduct });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};

export const deleteProduct = async (req, res) => {
    const { pid } = req.params;
    try {
        const deletedProduct = await productRepository.delete(pid);
        if (!deletedProduct) {
            return res.status(ERROR_CODES.NOT_FOUND).json({ status: "error", message: ERROR_MESSAGES.PRODUCT_NOT_FOUND });
        }
        res.json({ status: "success", message: "Producto eliminado exitosamente", product: deletedProduct });
    } catch (error) {
        res.status(ERROR_CODES.INTERNAL_SERVER_ERROR).json({ status: "error", message: ERROR_MESSAGES.SERVER_ERROR });
    }
};
