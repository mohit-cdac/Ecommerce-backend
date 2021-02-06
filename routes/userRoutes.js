import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  getUsers,
  getUserById,
  deleteUserById,
  getUserProfile,
  updateUser,
  updateUserProfile,
  loginWithGoogle,
  getGoogleUsers,
} from "../controller/userController.js";

import { getStoresByUser } from '../controller/storeController.js'

import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/", protect, admin, getUsers);
router.get("/googleUsers", protect, admin, getGoogleUsers);
router.post("/login", authUser);
router.post("/loginWithGoogle", loginWithGoogle);
router.post("/register", registerUser);
router.get("/profile", protect, getUserProfile);
router.get("/:id", protect, admin, getUserById);
router.delete("/:id", protect, admin, deleteUserById);

router.put("/:id", protect, admin, updateUser);
router.put("/:id/update", protect, updateUserProfile);

router.get("/:id/store", protect, getStoresByUser);

export default router;
