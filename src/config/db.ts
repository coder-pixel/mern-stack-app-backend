import mongoose from "mongoose";
import { MONGO_DB_URI } from "./index";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_DB_URI!);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};
