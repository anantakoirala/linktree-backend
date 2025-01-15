import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import path from "path";
import fs from "fs";
import { getBaseUrl } from "../utils/getBaseUrl";

export const uploadProfileImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.body;

  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const fileName = req.file.originalname;
    console.log("orignal url", req.get("host"));

    if (req.userId !== _id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await User.updateOne(
      { _id: req.userId },
      { $set: { image: req.file.filename } }
    );

    const updatedUser = await User.findOne({ _id: req.userId });

    const user = {
      ...updatedUser?.toObject(),
      image: updatedUser?.image
        ? getBaseUrl(req, `/static/${updatedUser?.image}`)
        : "",
    };

    res
      .status(200)
      .json({ success: true, message: "File uploaded successfully", user });
  } catch (error) {
    if (req.file) {
      // Resolve the path relative to the root folder (not the current directory)
      const filePath = path.resolve("public", "images", req.file.filename);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
        console.log(`File deleted: ${filePath}`);
      } else {
        console.log(`File not found: ${filePath}`);
      }
    }
    next(error);
  }
};

export const updateTheme = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { theme } = req.body;
    console.log("theme", theme);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await User.updateOne(
      { _id: req.userId },
      { $set: { theme: theme } }
    );

    const updatedUser = await User.findOne({ _id: req.userId });
    const user = {
      ...updatedUser?.toObject(),
      image: updatedUser?.image
        ? getBaseUrl(req, `/static/${updatedUser?.image}`)
        : "",
    };
    res.status(200).json({
      success: true,
      message: "Theme Updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};
