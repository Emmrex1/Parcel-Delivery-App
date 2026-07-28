import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import swaggerUI from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { globalLimiter } from "./middleware/ratelimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorhandler.js";
 import authRoutes from "./routes/authRoutes.js";

dotenv.config();

 const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));

app.use(compression());

app.use(globalLimiter); 

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get("/health", (req, res) => {
    res.status(200).json({ status: "success", message: " Server is healthy" });
});
 app.use("/api/auth", authRoutes);

 
app.use(notFoundHandler);   
app.use(errorHandler);




export default app;
