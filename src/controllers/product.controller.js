import { ProductRepository } from '../dao/repositories/product.repository.js';
import { ERROR_CODES, ERROR_MESSAGES } from '../utils/errorCodes.js';

const productRepository = new ProductRepository();

export const getProducts = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 15;
    const querySort = req.query.sort || "defa";
    let sort = {};

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
        const result = await productRepository.findAll({ page, limit, sort });

        res.status(200).json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${querySort}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${querySort}` : null
        });
    } catch (error) {
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

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productRepository.create(req.body);
        res.status(201).json({ status: "success", message: "Producto creado exitosamente", product: newProduct });
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
