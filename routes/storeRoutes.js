import express from "express";
import {
  createStore,
  getMyStores,
  deleteStore,
  getStoreById,
  updateStore
} from "../controller/storeController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", protect, createStore);
router.get("/getMyStore", protect, getMyStores);
router.delete("/:id",protect , deleteStore);
router.get("/:id", protect, getStoreById);
router.put("/:id/update", protect, updateStore);

export default router;
