import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./model/User.js";

dotenv.config();

const emmAdmin = async () => {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || "";

    let admin = await User.findOne({ email });

    if (admin) {
      console.log("Admin user already exists");
      console.log("Admin details:");
      console.log({ name: admin.name, email: admin.email, role: admin.role });
    } else {
      admin = new User({
        name,
        email,
        password,
        
      });

      await admin.save();
      console.log("Admin user created successfully");
      console.log("Admin details:");
      console.log({ name: admin.name, email: admin.email, role: admin.role });
    }

    await mongoose.disconnect();
    process.exit(0);

    
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1); 
  }
};
emmAdmin();