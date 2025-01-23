import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { editSetting, getSetting } from "../controllers/settingController";

const router = express.Router();

router.get("/get-setting", authMiddleware, getSetting);
router.patch("/edit-setting", authMiddleware, editSetting);

export default router;
