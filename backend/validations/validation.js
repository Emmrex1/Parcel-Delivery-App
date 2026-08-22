import joi from 'joi';

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const addUserSchema = joi.object({
  name: joi.string().min(2).max(100).required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});

export const createParcelSchema = joi.object({
  senderName: joi.string().min(2).max(100).required(),
  senderAddress: joi.string().min(8).max(200).required(),
  senderPhone: joi.string().min(10).max(15).required(),
  receiverName: joi.string().min(2).max(100).required(),
  receiverAddress: joi.string().min(8).max(200).required(),
  receiverPhone: joi.string().min(10).max(15).required(),
  weight: joi.number().positive().required(),
  originCity: joi.string().min(2).max(100).required(),
  destinationCity: joi.string().min(2).max(100).required(),
  shipmentType: joi.string().valid('national', 'international').required(),
  deliveryType: joi.string().valid('sameday', 'overnight', 'standard').required(),
  parcelCategory: joi.string().valid('document', 'electronics', 'clothing', 'fragile', 'food', 'cosmetics', 'medicine', 'books', 'small_package', 'large_package').required(),
});

export const addCheckpointSchema =  joi.object ({
  location: joi.string().min(2).max(200).required(),
  title:  joi.string().min(2).max(200).required(),
  description: joi.string().allow("",null),
  status: joi.string().valid("arrived", "in_transit", "out_for_delivery", "delivered").required()
})

// export const CalculateCostSchema = joi.object({
//   originCity: joi.string().min(2).max(100).required(),
//   destinationCity: joi.string().min(2).max(100).required(),