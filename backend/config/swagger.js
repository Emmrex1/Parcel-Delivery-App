// import swaggerJSDoc from "swagger-jsdoc";

// const swaggerDefinition = {
//   openapi: "3.0.0",
//   info: {
//     title: "Parcel Delivery API",
//     version: "1.0.0",
//     description: "API documentation for the Parcel Delivery Web Application",
//   },
//   servers: [
//     {
//       url: "http://localhost:" + (process.env.PORT || 5000),
//       description: "Development server",
//     },
//   ],
//   components: {
//     securitySchemes: {
//       bearerAuth: {
//         type: "http",
//         scheme: "bearer",
//         bearerFormat: "JWT",
//       },
//     },
//   },
//   security: [
//     {
//       bearerAuth: [],
//     },
//   ],
// };

// const options = {
//     swaggerDefinition,
//     apis: ["./routes/*.js"], // Path to the API routes
// }

// export const swaggerSpec = swaggerJSDoc(options);

import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",

  info: {
    title: "Parcel Delivery API",
    version: "1.0.0",
    description:
      "API documentation for the Parcel Delivery Web Application",
  },

  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: "Development server",
    },
  ],

  components: {
  
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },

    schemas: {

      Parcel: {
        type: "object",

        properties: {
          _id: {
            type: "string",
            example: "6a84cb21c23785a8c69cb842",
          },

          trackingNumber: {
            type: "string",
            example: "TRK-2026-001234",
          },

          senderName: {
            type: "string",
            example: "Ali Ahmed",
          },

          senderPhone: {
            type: "string",
            example: "+2348012345678",
          },

          senderAddress: {
            type: "string",
            example: "12 Marina Road, Lagos",
          },

          receiverName: {
            type: "string",
            example: "Zain Khan",
          },

          receiverPhone: {
            type: "string",
            example: "+2348098765432",
          },

          receiverAddress: {
            type: "string",
            example: "25 Airport Road, Abuja",
          },

          shipmentType: {
            type: "string",
            enum: ["national", "international"],
            example: "national",
          },

          originCity: {
            type: "string",
            example: "Lagos",
          },

          destinationCity: {
            type: "string",
            example: "Abuja",
          },

          deliveryType: {
            type: "string",
            enum: [
              "sameday",
              "overnight",
              "standard",
            ],
            example: "overnight",
          },

          parcelCategory: {
            type: "string",
            enum: [
              "document",
              "electronics",
              "clothing",
              "fragile",
              "food",
              "cosmetics",
              "medicine",
              "books",
              "small_package",
              "large_package",
            ],
            example: "electronics",
          },

          weight: {
            type: "number",
            minimum: 0,
            example: 3.5,
          },

          price: {
            type: "number",
            minimum: 0,
            example: 3500,
          },

          status: {
            type: "string",
            enum: [
              "arrived",
              "in_transit",
              "out_for_delivery",
              "delivered",
            ],
            example: "in_transit",
          },

          checkpoints: {
            type: "array",

            items: {
              $ref: "#/components/schemas/Checkpoint",
            },
          },

          createdAt: {
            type: "string",
            format: "date-time",
          },

          updatedAt: {
            type: "string",
            format: "date-time",
          },
        },
      },
      // Checkpoint Schema
      
      Checkpoint: {
        type: "object",

        properties: {
          location: {
            type: "string",
            example: "Lagos",
          },

          title: {
            type: "string",
            example: "Parcel arrived at Lagos Branch",
          },

          description: {
            type: "string",
            example:
              "Parcel has been received at Lagos Branch and is ready for shipment.",
          },

          status: {
            type: "string",
            enum: [
              "arrived",
              "in_transit",
              "out_for_delivery",
              "delivered",
            ],
            example: "arrived",
          },

          timestamp: {
            type: "string",
            format: "date-time",
            example: "2026-08-22T10:30:00.000Z",
          },

          updatedBy: {
            type: "string",
            description: "MongoDB ObjectId of the admin who updated the checkpoint",
            example: "6a84cb21c23785a8c69cb842",
          },
        },
      },
    },
  },

  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,

  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);