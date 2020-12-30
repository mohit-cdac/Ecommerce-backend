import express from "express";
import {
  getProducts,
  getTopProducts,
  getProductsById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview
} from "../controller/productController.js";
import { protect , admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/top", getTopProducts);
router.get("/:id", getProductsById);
router.delete("/:id", protect , admin , deleteProduct);
router.post('/',protect, admin, createProduct);
router.put('/:id',protect, admin, updateProduct)

router.post('/:id/reviews' ,protect, createProductReview)

export default router;
