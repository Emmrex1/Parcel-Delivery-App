import Parcel from "../model/Parcel.js";
import { calculateCost } from "../services/calculateCost.js";
import { generateTrackingId } from "../services/generateTrackId.js";
import { createParcelSchema } from "../validations/validation.js";

// Create a new parcel
export const createParcel = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = createParcelSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // Calculate parcel delivery cost
    const priceInfo = calculateCost({
      originCity: value.originCity,
      destinationCity: value.destinationCity,
      shipmentType: value.shipmentType,
      deliveryType: value.deliveryType,
      parcelCategory: value.parcelCategory,
      weight: value.weight,
    });


    const trackingNumber = generateTrackingId();

    if (!trackingNumber) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate tracking number",
      });
    }

    // Create parcel in MongoDB
    const parcel = await Parcel.create({
      ...value,

      trackingNumber,

      price: priceInfo.price,

      checkpoints: [
        {
          location: value.originCity,
          status: "arrived",
          title: `Parcel arrived at ${value.originCity} Branch`,
          description: `Parcel has been received at ${value.originCity} Branch and is ready for shipment.`,
          updatedBy: req.user ? req.user._id : null,
        },
      ],
    });

    // Send response
    return res.status(201).json({
      success: true,
      message: "Parcel created successfully",
      parcel,
    });
  } catch (error) {
    next(error);
  }
};


// Get parcel by tracking number
export const getParcelByTrackingNumber = async (req, res, next) => {
  try {
    const parcel = await Parcel.findOne({
      trackingNumber: req.params.trackingNumber,
    }).populate("checkpoints.updatedBy", "name email");

    if (!parcel) { 
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Parcel retrieved successfully",
      parcel,
    });
  } catch (error) {
    next(error);
  }
};