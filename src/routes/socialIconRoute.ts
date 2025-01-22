import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getAllIcons,
  saveSocialIcons,
  updateSocialIconStatus,
} from "../controllers/socialIconsController";

const router = express.Router();

router.post("/save-social-icons", authMiddleware, saveSocialIcons);
router.get("/get-all-icons", authMiddleware, getAllIcons);
router.patch(
  "/update-social-icon-status/:socialIconId",
  authMiddleware,
  updateSocialIconStatus
);

export default router;
