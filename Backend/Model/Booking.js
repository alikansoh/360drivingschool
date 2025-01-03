import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
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
    type: String,
    required: true,
  },
 
  packagename: {
    type: String,
    required: true,
  },
  
  
  
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
