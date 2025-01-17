import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import path from "path";
import fs from "fs";
import { getBaseUrl } from "../utils/getBaseUrl";
import Links from "../models/Links";
import Product from "../models/Product";

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
      profile_title: updatedUser?.profile_title
        ? updatedUser.profile_title
        : updatedUser?.username,
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
    const { field, value } = req.body;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const updateData = { [field]: value };

    const result = await User.updateOne(
      { _id: req.userId },
      { $set: updateData }
    );

    const updatedUser = await User.findOne({ _id: req.userId });
    const user = {
      ...updatedUser?.toObject(),
      profile_title: updatedUser?.profile_title
        ? updatedUser.profile_title
        : updatedUser?.username,
      image: updatedUser?.image
        ? getBaseUrl(req, `/static/${updatedUser?.image}`)
        : "",
    };

    res.status(200).json({
      success: true,
      message: `${field} updated successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const previewDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    console.log("username", username);
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userLinks = await Links.find({ owner: user._id });
    const userProducts = await Product.find({ owner: user._id });
    const products = userProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      image: product.image ? checkUrlImage(req, product.image) : "",
      publish: product.publish,
      url: product.url,
      price: product.price,
    }));

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image ? getBaseUrl(req, `/static/${user?.image}`) : "",
        profile_title: user.profile_title ? user.profile_title : user.username,
        theme: user.theme,
      },
      links: userLinks,
      userProducts: products,
    });
  } catch (error) {
    next(error);
  }
};

const checkUrlImage = (req: Request, image: string) => {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  } else {
    const imageUrl = getBaseUrl(req, `/static/${image}`);
    return imageUrl;
  }
};
