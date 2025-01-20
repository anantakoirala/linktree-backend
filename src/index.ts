import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoute";
import linkRoutes from "./routes/linkRoute";
import shopRoutes from "./routes/shopRoute";
import profileRoutes from "./routes/profileRoute";
import errorResponse from "./middleware/errorResponse";
import path from "path";
import multer from "multer";

dotenv.config();
const app = express();

// Middleware setup
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Serve static files from the "public" folder
app.use("/static", express.static(path.resolve("public/images")));

// Serve static files from the "public/profile" folder at the "/profile" route
app.use("/profile", express.static(path.resolve("public/profile")));

connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Other routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/link", linkRoutes);
app.use("/api/v1/shop", shopRoutes);
app.use("/api/v1/profile", profileRoutes);

// Catch-all error handler
app.use(errorResponse);

// Server setup
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});
