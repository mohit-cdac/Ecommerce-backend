import mongoose from "mongoose";

const biddersSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  bidPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  mailSent: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const bidSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    bidders: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "User",
        },
        bidPrice: {
          type: Number,
          required: true,
        },
        date: {
          type: String,
          required: true,
        },
        mailSent: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
    ],
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    bidStartingPrice: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    allBids: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "User",
        },        
        bidPrice: {
          type: Number,
          required: false,
        },
        date: {
          type: String,
          required: false,
        },
        mailSent: {
          type: Boolean,
          required: false,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const Bidding = mongoose.model("Bidding", bidSchema);
export default Bidding;
