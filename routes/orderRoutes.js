import express from "express";
const router = express.Router();

import {
  addOrderItems,
  getOrders,
  getMyOrders,
} from "../controller/orderController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.post("/", protect, addOrderItems);
router.get("/", protect, admin, getOrders);
router.get("/myOrders", protect, getMyOrders);

export default router;
