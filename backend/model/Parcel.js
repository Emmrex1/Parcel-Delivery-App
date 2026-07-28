import mongoose from "mongoose";

const checkpointSchema = new mongoose .Schema (
    {
        location: {
            type: String,
            require: true,
            trim : true,

        },
        
        title : {
           type: String,
           require: true,
           trim: true,
        },
         
        description : {
            type : String,
            trim : true,
         },
         
         status : {
            type: String,
            enum: ["arrived", "in_transit", "out_for_delivery", "delivered"],
            require: true,
         },
         
         timestamps : {
           type: Date,
           default: Date.now
         },

         UpdateBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            trim: true,
         },
    },
      {
        _id: false,
      },
)

const parcelSchema = new mongoose.Schema (
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
         senderPhone : {
            type: String,
            required: true,
            trim: true,
         },
         senderAddress: {
            type: String,
            required: true,
            unique: true,
            index: true,
         },
         receiverName: {
            type: String,
            required: true,
            trim: true,

         },
         receiverPhone : {
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
            required: true
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
         deliveryType:{
            type: String,
            enum: ["sameday", "overnite", "standard"],
            required: true,
         },
         parcelCategory: {
            type: String,
            enum: ["document", "electronics", "clothing", "fragile", "food", "cosmetics", "medicine", "books","small_package", "large_package"],
            required: true,
            trim : true,
         },
        weight: {
         type : Number,
         require: true,
         min : 0,
        },
         price: {
            type: Number,
            required: true,
            min: 0,
         },
         checkpoints: [checkpointSchema],
      }
)  