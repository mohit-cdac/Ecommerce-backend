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


export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

export const getOrders = asyncHandler(async (req, res) => {
  console.log("API calle");
  const orders = await Order.find({});
  res.json(orders);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});
