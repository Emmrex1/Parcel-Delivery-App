import mongoose from "mongoose";

const checkpointSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "arrived",
        "in_transit",
        "out_for_delivery",
        "delivered",
      ],
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    _id: false,
  }
);


const parcelSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    senderPhone: {
      type: String,
      required: true,
      trim: true,
    },

    senderAddress: {
      type: String,
      required: true,
      trim: true,
    },

    receiverName: {
      type: String,
      required: true,
      trim: true,
    },

    receiverPhone: {
      type: String,
      required: true,
      trim: true,
    },

    receiverAddress: {
      type: String,
      required: true,
      trim: true,
    },

    shipmentType: {
      type: String,
      enum: ["national", "international"],
      required: true,
    },

    originCity: {
      type: String,
      required: true,
      trim: true,
    },

    destinationCity: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryType: {
      type: String,
      enum: ["sameday", "overnight", "standard"],
      required: true,
    },

    parcelCategory: {
      type: String,
      enum: [
        "document", "electronics", "clothing","fragile","food","cosmetics","medicine","books","small_package","large_package",
      ],
      required: true,
      trim: true,
    },

    weight: {
      type: Number,
      required: true,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    checkpoints: [checkpointSchema],
  },
  {
    timestamps: true,
  }
);


const Parcel = mongoose.model("Parcel", parcelSchema);

export default Parcel;