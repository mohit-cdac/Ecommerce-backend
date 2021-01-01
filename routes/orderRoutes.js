import express from 'express';
const router = express.Router();

import {
    addOrderItems,
    getOrders,
    getMyOrders,
    getOrderById,
  } from "../controller/orderController.js";
  

import { protect, admin } from '../middleware/authMiddleware.js'



router.get('/:id', getOrderById);
router.post("/", protect, addOrderItems);
router.get("/", protect, admin, getOrders);
router.get("/myOrders", protect, getMyOrders);

export default router;
