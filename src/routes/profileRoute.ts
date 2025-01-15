import express, { Response, Request } from "express";
import {
  updateTheme,
  uploadProfileImage,
} from "../controllers/profileController";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/authMiddleware";

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const router = express.Router();

router.post("/add", authMiddleware, upload.single("file"), uploadProfileImage);
router.post("/updateTheme", authMiddleware, updateTheme);

export default router;
