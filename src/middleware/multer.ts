import multer from "multer";
import path from "path";
// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("file hello", file);
    cb(null, "uploads/"); // Save images to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    console.log("Uploading file:", file);
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid conflicts
  },
});

// Initialize multer
export const upload = multer({ storage: storage });
