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
import parcelRoutes from "./routes/parcelRoute.js";
import dashBoardRoutes from "./routes/dashBoardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoute.js";


dotenv.config();

 const app = express();

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.0.199:5173",
  // add your deployed frontend URL here once you deploy, e.g.:
  // "https://rapidxpress.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    // Only set this to true if you end up using cookie-based auth
    // (e.g. refresh tokens via cookieParser). Not needed for your
    // current Bearer-token flow.
    // credentials: true,
  })
);

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
app.use("/api/parcels", parcelRoutes);
app.use("/api/dashboard", dashBoardRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);





export default app;
