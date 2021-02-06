import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const storeSchema = mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },   
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    googleUser: {
      type: Boolean,
      required: true,
      default: false,
      ref: "GoogleUser",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);


const Store = mongoose.model("Store", storeSchema);
export default Store;
