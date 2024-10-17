import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get("/:pid", getProductById);
router.post("/", isAuthenticated, isAdmin, createProduct);
router.put("/:pid", isAuthenticated, isAdmin, updateProduct);
router.delete("/:pid", isAuthenticated, isAdmin, deleteProduct);


export default router;