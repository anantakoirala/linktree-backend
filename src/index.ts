import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./utils/db";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoute";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

connectDB();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("hello");
});
