import express from "express";
import {
  changeProductStatus,
  fetchOg,
  getAllProducts,
  saveCustomProduct,
  saveProduct,
  updateProduct,
} from "../controllers/shopController";
import { authMiddleware } from "../middleware/authMiddleware";
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

router.get("/get-og", fetchOg);
router.get("/get-all-products", authMiddleware, getAllProducts);
router.patch(
  "/change-product-status/:productId",
  authMiddleware,
  changeProductStatus
);
router.post(
  "/save-product",
  authMiddleware,

  saveProduct
);

router.post(
  "/save-custom-product",
  authMiddleware,
  upload.single("file"),
  saveCustomProduct
);

router.patch(
  "/update-product/:productId",
  authMiddleware,
  upload.single("file"),
  updateProduct
);

export default router;
