import express from 'express';
import { addOrderItems, getOrderById, getMyOrders, getOrders, } from '../controllers/orderController.js'

const router = express.Router();

import { protect, admin } from '../middleware/authMiddleware.js'



router.get('/:id', getOrderById);
     
        


export default router

