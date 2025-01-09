import express from "express";
import { validate } from "../middleware/validate";
import { userLoginSchema } from "../zodSchema/loginSchema";
import { userRegisterSchema } from "../zodSchema/userRegisterSchema";
import { login, register } from "../controllers/authController";
const router = express.Router();

router.post("/login", validate(userLoginSchema), login);
router.post("/register", validate(userRegisterSchema), register);

export default router;
