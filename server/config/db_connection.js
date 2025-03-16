import mongoose from "mongoose";
import "dotenv/config";
const connection_string = process.env.MONGO_URI;

export const dbConnection = async () => {
  try {
    await mongoose.connect(connection_string);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw new Error("Failed to connect to MongoDB");
  }
};
