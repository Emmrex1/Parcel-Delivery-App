import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Parcel Delivery API",
    version: "1.0.0",
    description: "API documentation for the Parcel Delivery Web Application",
  },
  servers: [
    {
      url: "http://localhost:" + (process.env.PORT || 5000),
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
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
    swaggerDefinition,
    apis: ["./routes/*.js"], // Path to the API routes
}

export const swaggerSpec = swaggerJSDoc(options);