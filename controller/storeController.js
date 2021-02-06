import User from "../models/userModel.js";
import Store from "../models/storeModel.js";
import Product from "../models/productModel.js";
import GoogleUser from "../models/GoogleUserModel.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

export const createStore = asyncHandler(async (req, res) => {
  const store = new Store({
    storeName: req.body.storeName || "Sample store",
    email: req.body.email || req.user.email,
    isAdmin: req.user.isAdmin,
    googleUser: req.user.googleUser,
    user: req.user,
  });
  try {
    const createdStore = await store.save();
    const stores = await Store.find({ user: req.user._id });
    res.status(201).json(stores);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error);
  }
});

export const getMyStores = asyncHandler(async (req, res) => {
  let store;

  if (req.user.isAdmin) {
    store = await Store.find({});
  } else {
    store = await Store.find({ user: req.user });
  }
  if (store) {
    res.json({ store });
  } else {
    res.json({ message: "No Store found" });
  }
});

// admin get store list by user
export const getStoresByUser = asyncHandler(async (req, res) => {
  let store;
  let id = req.params.id;

  if (req.user.isAdmin) {
    store = await Store.find({ user: id });
    if (store) {
      res.json({ store });
    } else {
      res.json({ message: "No Store found" });
    }
  } else {
    res.status(404);
    throw new Error("Not authorized as admin");
  }
});

export const deleteStore = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const store = await Store.findById(id);
  if (store) {
    const products = await Product.find({storeId: id}).remove()
    await store.remove();

    const stores = await Store.find({ user: req.user._id });
    res.json({ stores, message: "Store removed" });
  } else {
    res.status(404);
    throw new Error("Store not found");
  }
});

export const getStoreById = asyncHandler(async (req, res) => {
  const store = await Store.findOne({ _id: req.params.id });
  if (store) {
    res.status(200).json(store);
  } else {
    res.status(404);
    throw new Error("Store Not Found");
  }
  // if(store) {
  //   store.storeName = req.body.storeName || store.storeName;
  //   store.email = req.body.email || store.email;
  //   await store.save();
  //   res.json({store , message: "Store Updated successfully"})
  // }
  // res.json({message:"getStoreById API"})
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (store) {
    // if(store.user._id != req.user._id) {
    //   res.status(401);
    //   throw new Error("UnAuthorized user")
    // }
    store.storeName = req.body.storeName || store.storeName;
    store.email = req.body.email || store.email;

    await store.save();
    res.status(200).json(store);
  } else {
    res.status(404);
    throw new Error("Store Not Found");
  }

  res.json({ message: "UPDATE Store APU", id: req.params.id });
});
