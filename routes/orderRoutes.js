import express from 'express';
import { addOrderItems, getOrderById, getMyOrders, getOrders, } from '../controllers/orderController.js'

const router = express.Router();

import { protect, admin } from '../middleware/authMiddleware.js'



router.get('/:id', getOrderById, (req, res) => {
    res.json(res.order)
    });
    async function getOrderById (req, res, next) {
        let order 
        try {
            order = await Order.findById(req.params.id);
            if(order == null) {
                return res.status(404).json({ message: 'cannot find the order' })
            }
        } catch (err) {
            return res.status(500).json({ message: err.message })
        }
        res.order = order
        next();
    }
        


export default router

