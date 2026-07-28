import mongoose from "mongoose";
import chalk from "chalk";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "parcel-delivery-app",
    });

    console.log(
      chalk.blue(`MongoDB Connected: ${conn.connection.host}`)
    );
  } catch (error) {
    console.error(
      chalk.red(`MongoDB connection error: ${error.message}`)
    );
    process.exit(1);
  }
};

