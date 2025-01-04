import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import Booking from "./Routes/Booking.js";
import Package from "./Routes/Package.js";
import Course from "./Routes/Course.js";
import User from "./Routes/User.js";
const PORT = process.env.PORT || 4000;
const app = express();
dotenv.config(); // Load environment variables

// Middleware
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "*", 
    credentials: true, 
  })
);

// Routes
app.use("/booking", Booking); 
app.use("/package", Package);
app.use("/course", Course);
app.use("/user", User);
app.use('/uploads', express.static('uploads'));


mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected and Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });
