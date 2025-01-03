import multer from "multer";
import path from "path";

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + path.extname(file.originalname); // Unique filename using timestamp
    cb(null, uniqueSuffix); // Save the file with the unique name
  },
});

// Initialize multer with the storage configuration
export const upload = multer({ storage });
