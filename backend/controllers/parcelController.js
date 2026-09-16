import Parcel from "../model/Parcel.js";
import { calculateCost } from "../services/calculateCost.js";
import { generateTrackingId } from "../services/generateTrackId.js";
import { addCheckpointSchema, CalculateCostSchema, createParcelSchema } from "../validations/validation.js";

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
      parcel
    });
  } catch (error) {
    next(error);
  }
};
export const addCheckpoint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { error, value } = addCheckpointSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    const parcel = await Parcel.findById(id);

    if (!parcel) {
      return res.status(404).json({
        message: "Parcel not found",
      });
    }
    

    const checkpoint = {
  ...value,
  updatedBy: req.user ? req.user._id : null,
  timestamp: new Date(),
};

    parcel.checkpoints.push(checkpoint);

    parcel.status = value.status;

    await parcel.save();

    return res.status(201).json({
      success: true,
      message: "Checkpoint added successfully",
      parcel,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllParcels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const status = req.query.status;
    const search = req.query.search;
    const shipmentType = req.query.shipmentType;

    const matchStage = {};

    if (status) {
      matchStage["lastCheckpoint.status"] = status;
    }

    if (search) {
      matchStage.trackingNumber = {
        $regex: search,
        $options: "i",
      };
    }

    if (shipmentType) {
      matchStage.shipmentType = shipmentType;
    }

    const skip = (page - 1) * limit;

    const [parcels, total] = await Promise.all([
      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: {
              $arrayElemAt: ["$checkpoints", -1],
            },
          },
        },
        {
          $match: matchStage,
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]),

      Parcel.aggregate([
        {
          $addFields: {
            lastCheckpoint: {
              $arrayElemAt: ["$checkpoints", -1],
            },
          },
        },
        {
          $match: matchStage,
        },
        {
          $count: "total",
        },
      ]),
    ]);

    const totalCount = total.length > 0 ? total[0].total : 0;

    res.status(200).json({
      data: parcels,
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (error) {
    next(error);
  }
};
 export const calculateCostCalculator = async (req, res, next) => {
  try {
    const { error, value } = CalculateCostSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const cost = calculateCost(value);

    return res.status(200).json({
      success: true,
      message: "Delivery cost calculated successfully",
      cost,
    });
  } catch (error) {
    next(error);
  }
};

export const getParcelById = async (req, res) => {
  try {
    const parcel = await Parcel.findById(req.params.id).populate(
      "checkpoints.updatedBy",
      "name email",
    );

    if (!parcel) {
      return res.status(404).json({
        success: false,
        message: "Parcel not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parcel retrieved successfully",
      parcel,
    });
  } catch (error) {
    console.error("Get parcel by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve parcel",
    });
  }
};