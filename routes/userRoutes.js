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
} from "../controller/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.get("/", protect, admin, getUsers, updateUser, updateUserProfile);
router.post("/login", authUser);
router.post("/register", registerUser);
router.get("/profile", protect, getUserProfile);
router.get("/:id", protect, admin, getUserById);
router.delete("/:id", protect, admin, deleteUserById);

router.put("/:id", protect, admin, updateUser);
router.put("/:id/update", protect, updateUserProfile);

export default router;
