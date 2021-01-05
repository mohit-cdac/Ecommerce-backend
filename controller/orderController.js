import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import url from "url";

import Insta from "instamojo-nodejs";
import { response } from "express";

const API_KEY = "test_6f5af737909f98f5878c3b362e6";

const AUTH_KEY = "test_a9fef6de50eea6f13825d712b96";

Insta.setKeys(API_KEY, AUTH_KEY);

Insta.isSandboxMode(true); // only for testing otherwise false

export const getOrderById = asyncHandler(async (req, res, next) => {
  let order;
  try {
    order = await Order.findById(req.params.id).populate("user googleUser");
    if (order == null) {
      return res.status(404).json({ message: "cannot find the order" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.json(order);
});

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
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      googleUser:req.user._id,
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
  const orders = await Order.find({}).populate("user");
  res.json(orders);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// pay order
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const REDIRECT_URL = "http://localhost:4200/";

  var data = new Insta.PaymentData();

  data.setRedirectUrl(REDIRECT_URL);

  data.purpose = req.body.purpose;
  data.amount = req.body.amount;
  data.buyer_name = req.body.buyer_name;
  data.redirect_url = req.body.redirect_url;
  data.email = req.body.email;
  data.phone = req.body.phone;
  data.send_email = false;
  data.webhook = "http://www.example.com/webhook/";
  data.send_sms = false;
  data.allow_repeated_payments = false;

  Insta.createPayment(data, function (error, response) {
    if (error) {
      // some error
    } else {
      // Payment redirection link at response.payment_request.longurl
      const responseData = JSON.parse(response);
      console.log(responseData);
      const redirectUrl = responseData.payment_request.longurl;
      console.log(redirectUrl);

      res.status(200).json({ redirectUrl });
    }
  });

  // const order = await Order.findById(req.params.id);
  // if (order) {
  //   order.isPaid = true;
  //   order.paidAt = Date.now();
  //   order.paymentResult = {
  //     id: req.body.id,
  //     status: req.body.status,
  //     update_time: req.body.update_time,
  //     email_address: req.body.payer.email_address,
  //   };

  //   const updatedOrder = await order.save();
  //   res.json(updatedOrder);
  // } else {
  //   res.status(404);
  //   throw new Error("Order not found");
  // }
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export const callback = asyncHandler(async (req, res) => {
  console.log(req.body);
  let url_parts = url.parse(req.url, true),
    responseData = url_parts.query;
  console.log("------------");
  console.log(responseData);
  console.log("------------");

  // res.json({ responseData});

  const order = await Order.findById(responseData.order_id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: responseData.user_id,
      status: responseData.payment_status,
      update_time: req.body.update_time,
      email_address: responseData.email,
    };

    const updatedOrder = await order.save();

    // res.json(updatedOrder);
    return res.redirect("http://localhost:4200/profile");
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
