import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    // keep both older and newer field names for compatibility
    name: { type: String, trim: true },
    fullName: { type: String, trim: true },
    telephone: { type: String, trim: true },
    phone: { type: String, trim: true },
    postCode: { type: String, trim: true },
    location: { type: String, trim: true },
    timetocontact: { type: String, trim: true },
    contactMethod: { type: String, enum: ["email", "phone"], default: "phone" },
    transmissionType: { type: String, trim: true },
    bookingMode: { type: String, trim: true },
    packagename: { type: String, trim: true },
    packageName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    status: { type: String, enum: ["new", "confirmed", "cancelled"], default: "new" },
    metadata: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

// useful indexes
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ phone: 1 });

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;