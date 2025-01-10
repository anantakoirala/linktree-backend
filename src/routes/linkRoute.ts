import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { createLink, getAllLinks } from "../controllers/linkController";

const router = express.Router();

router.post("/create", authMiddleware, createLink);

router.get("/all", authMiddleware, getAllLinks);

export default router;
