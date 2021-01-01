import Order from "../models/orderModel.js";
import asyncHandler from "express-async-handler";

export const getOrderById = asyncHandler(async (req, res, next) => {
    let order 
    try {
        order = await Order.findById(req.params.id);
        if(order == null) {
            return res.status(404).json({ message: 'cannot find the order' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
    res.json(order)
})


