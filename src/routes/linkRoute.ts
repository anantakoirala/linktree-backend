import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createLink,
  deleteLink,
  getAllLinks,
  removeImage,
  saveLinkImage,
} from "../controllers/linkController";

import multer from "multer";

const router = express.Router();

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

router.post(
  "/save-link-image",
  authMiddleware,
  upload.single("file"),
  saveLinkImage
);
router.post("/remove-image", authMiddleware, removeImage);
router.post("/create", authMiddleware, createLink);
router.delete("/delete/:linkId", authMiddleware, deleteLink);
router.get("/all", authMiddleware, getAllLinks);

export default router;
