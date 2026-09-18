import Parcel from "../model/Parcel.js";
import User from "../model/User.js";
import { calculateCost } from "../services/calculateCost.js";
import { generateTrackingId } from "../services/generateTrackId.js";
import {
  addCheckpointSchema,
  CalculateCostSchema,
  createParcelSchema,
} from "../validations/validation.js";


// CREATE PARCEL

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

    let customerId;

   
    // CUSTOMER CREATES THEIR OWN PARCEL
    if (req.user.role === "customer") {
      customerId = req.user._id;
    }


    // ADMIN CREATES A PARCEL FOR A CUSTOMER
    if (req.user.role === "admin") {
      const { customerId: adminCustomerId } = req.body;

      if (!adminCustomerId) {
        return res.status(400).json({
          success: false,
          message: "Please select a customer for this parcel",
        });
      }

      const customer = await User.findOne({
        _id: adminCustomerId,
        role: "customer",
      });

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });
      }

      customerId = customer._id;
    }

    // SAFETY CHECK   
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Parcel customer could not be determined",
      });
    }

    // CALCULATE DELIVERY COST
    const priceInfo = calculateCost({
      originCity: value.originCity,
      destinationCity: value.destinationCity,
      shipmentType: value.shipmentType,
      deliveryType: value.deliveryType,
      parcelCategory: value.parcelCategory,
      weight: value.weight,
    });

    // GENERATE TRACKING NUMBER
    const trackingNumber = generateTrackingId();

    if (!trackingNumber) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate tracking number",
      });
    }

    // CREATE PARCEL
    const parcel = await Parcel.create({
      ...value,

      customer: customerId,

      trackingNumber,

      price: priceInfo.price,

      checkpoints: [
        {
          location: value.originCity,
          status: "arrived",
          title: `Parcel arrived at ${value.originCity} Branch`,
          description: `Parcel has been received at ${value.originCity} Branch and is ready for shipment.`,
          updatedBy: req.user._id,
        },
      ],
    });

    // POPULATE CUSTOMER
   
    await parcel.populate("customer", "name email");

    return res.status(201).json({
      success: true,
      message: "Parcel created successfully",
      parcel,
    });
  } catch (error) {
    next(error);
  }
};

// GET PARCEL BY TRACKING NUMBER

export const getParcelByTrackingNumber = async (req, res, next) => {
  try {
    const parcel = await Parcel.findOne({
      trackingNumber: req.params.trackingNumber,
    })
      .populate("customer", "name email")
      .populate("checkpoints.updatedBy", "name email");

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

// GET CUSTOMER'S OWN PARCELS

export const getMyParcels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const status = req.query.status;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const filter = {
      customer: req.user._id,
    };

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.trackingNumber = {
        $regex: search,
        $options: "i",
      };
    }

    const [parcels, total] = await Promise.all([
      Parcel.find(filter)
        .populate("customer", "name email")
        .populate("checkpoints.updatedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Parcel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: parcels,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};


// GET CUSTOMER'S OWN PARCEL BY ID

export const getMyParcelById = async (req, res, next) => {
  try {
    const parcel = await Parcel.findOne({
      _id: req.params.id,
      customer: req.user._id,
    })
      .populate("customer", "name email")
      .populate("checkpoints.updatedBy", "name email");

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

// Admin only.

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
      updatedBy: req.user._id,
      timestamp: new Date(),
    };

    parcel.checkpoints.push(checkpoint);

    parcel.status = value.status;

    await parcel.save();

    await parcel.populate("customer", "name email");

    return res.status(201).json({
      success: true,
      message: "Checkpoint added successfully",
      parcel,
    });
  } catch (error) {
    next(error);
  }
};


// Admin only.
export const getAllParcels = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const status = req.query.status;
    const search = req.query.search;
    const shipmentType = req.query.shipmentType;

    const matchStage = {};

    if (status) {
      matchStage.status = status;
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
      Parcel.find(matchStage)
        .populate("customer", "name email")
        .populate("checkpoints.updatedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Parcel.countDocuments(matchStage),
    ]);

    return res.status(200).json({
      success: true,
      data: parcels,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};

// CALCULATE DELIVERY COST

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

// Admin only.
export const getParcelById = async (req, res, next) => {
  try {
    const parcel = await Parcel.findById(req.params.id)
      .populate("customer", "name email")
      .populate("checkpoints.updatedBy", "name email");

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
    console.error("Get parcel by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve parcel",
    });
  }
};