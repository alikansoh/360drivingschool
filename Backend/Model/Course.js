import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    
    offer: {
        type: String,
    },
    
}, { timestamps: true });

export default mongoose.model('Course', courseSchema);
