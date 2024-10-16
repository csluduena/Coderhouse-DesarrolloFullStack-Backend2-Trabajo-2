import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js';
import { isAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get("/:pid", getProductById);
router.post("/", isAdmin, createProduct);
router.put("/:pid", isAdmin, updateProduct);
router.delete("/:pid", isAdmin, deleteProduct);

export default router;