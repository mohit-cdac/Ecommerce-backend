import mongoose from "mongoose";

const userSchema = {
  name: {
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
    type: String,
    required: true,
    default: true
  },
};

const GoogleUser = mongoose.model("GoogleUser", userSchema);
export default GoogleUser;
