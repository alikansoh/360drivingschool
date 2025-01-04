import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    postCode: {
      type: String,
      required: true,
    },
    timetocontact: {
      type: String,
      required: true,
    },
    transmissionType: {
      type: String, // Manual or Automatic
      required: true,
    },
    packagename: {
      type: String, // Can be a package name or course name
      required: true,
    },
  
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
