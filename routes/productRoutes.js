import express from "express";
import {
  getProducts,
  getTopProducts,
  getProductsById,
  createProduct,
  deleteProduct,
  updateProduct,
  createProductReview,
  getProductsByUser,
  userStoreProducts,
  createOrUpdateProductBid,
  getProductBiddingDetail,
  placeBid,
  endBid,
} from "../controller/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getProducts);
router.get("/getBidProduct/:id", getProductBiddingDetail);
router.get("/:userId/:storeId", userStoreProducts);
router.get("/myproducts/:id/:storeId", getProductsByUser);
router.get("/top", getTopProducts);
router.get("/:id", getProductsById);
router.delete("/:id", protect, deleteProduct);
// router.delete("/:id", protect , admin , deleteProduct);
// router.post('/',protect, admin, createProduct);
router.post("/", protect, createProduct);
// router.put('/:id',protect, admin, updateProduct)
router.put("/:id", protect, updateProduct);

router.post("/:id/reviews", protect, createProductReview);
router.post("/:id/bid/edit", protect, createOrUpdateProductBid);

router.post("/placeBid/:id", protect, placeBid);

router.put('/:id/bid/end' , protect , endBid )

export default router;
