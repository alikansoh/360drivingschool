import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Booking from "./Routes/Booking.js";
import Package from "./Routes/Package.js";
import Course from "./Routes/Course.js";
import User from "./Routes/User.js";

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// Enhanced CORS Configuration
const allowedOrigins = [
  "https://www.360driveacademy.co.uk",
  "https://360driveacademy.co.uk", // Without "www" for compatibility
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("CORS policy: This origin is not allowed"));
      }
    },
    credentials: true, // Allow cookies
  })
);

// Routes
app.use("/booking", Booking);
app.use("/package", Package);
app.use("/course", Course);
app.use("/user", User);
app.use("/uploads", express.static("uploads"));

// MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected and Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
