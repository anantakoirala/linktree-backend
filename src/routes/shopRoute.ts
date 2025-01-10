import express from "express";
import {
  fetchOg,
  getAllProducts,
  saveProduct,
} from "../controllers/shopController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.get("/get-og", fetchOg);
router.get("/get-all-products", authMiddleware, getAllProducts);
router.post("/save-product", authMiddleware, saveProduct);

export default router;
