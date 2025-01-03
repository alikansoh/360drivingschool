import {createBooking,deleteBooking,getBookingById,getBookings,updateBooking} from "../Controller/Booking.js"
import express from "express";
const router=express.Router();
router.get("/",getBookings);
router.get("/:id",getBookingById);
router.post("/",createBooking);
router.put("/:id",updateBooking);
router.delete("/:id",deleteBooking);
export default router
