import express from "express";
import { validate } from "../middleware/validate";
import { userLoginSchema } from "../zodSchema/loginSchema";
import { userRegisterSchema } from "../zodSchema/userRegisterSchema";
import {
  generateRefreshToken,
  login,
  logout,
  me,
  register,
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/login", validate(userLoginSchema), login);
router.get("/me", authMiddleware, me);
router.post("/register", validate(userRegisterSchema), register);
router.post("/refresh-token", generateRefreshToken);
router.get("/logout", authMiddleware, logout);

export default router;
