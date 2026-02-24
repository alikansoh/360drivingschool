import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sitemapRouter from "./Routes/sitemap.js";  // line 1


import Booking from "./Routes/Booking.js";
import Package from "./Routes/Package.js";
import Course from "./Routes/Course.js";
import User from "./Routes/User.js";
import reviewsRouter from "./Routes/reviews.js";
import BlogRoutes from "./Routes/Blog.js";

dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration
const allowedOrigins = [
  "https://www.360driveacademy.co.uk",
  "https://360driveacademy.co.uk",
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy: This origin is not allowed"));
    },
    credentials: true,
  })
);

// Static uploads serving
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/booking", Booking);
app.use("/package", Package);
app.use("/course", Course);
app.use("/user", User);
app.use("/blog", BlogRoutes);
app.use(reviewsRouter); // exposes GET /api/reviews
app.use("/", sitemapRouter);                        // line 2


// Default health-check
app.get("/", (_req, res) => res.json({ ok: true, time: new Date() }));

// Connect to MongoDB and start server
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