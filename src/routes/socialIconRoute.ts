import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getAllIcons,
  getSingleSocialIcon,
  saveSocialIcons,
  updateSocialIcon,
  updateSocialIconStatus,
} from "../controllers/socialIconsController";

const router = express.Router();

router.post("/save-social-icons", authMiddleware, saveSocialIcons);
router.get("/get-all-icons", authMiddleware, getAllIcons);
router.get(
  "/single-social-icon/:socialIconId",
  authMiddleware,
  getSingleSocialIcon
);
router.patch(
  "/update-social-icon-status/:socialIconId",
  authMiddleware,
  updateSocialIconStatus
);
router.patch(
  "/update-social-icon/:socialIconId",
  authMiddleware,
  updateSocialIcon
);

export default router;
