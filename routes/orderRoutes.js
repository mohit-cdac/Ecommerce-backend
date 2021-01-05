import express from "express";
const router = express.Router();

import {
  addOrderItems,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  callback,
} from "../controller/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.post("/", protect, addOrderItems);
router.get("/", protect, admin, getOrders);
router.get("/myOrders", protect, getMyOrders);
router.get("/callback", callback);
router.get("/:id", getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);

export default router;
