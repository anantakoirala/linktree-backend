import { NextFunction, Request, Response } from "express";
import Links from "../models/Links";
import { getBaseUrl } from "../utils/getBaseUrl";
import fs from "fs";
import path from "path";

export const createLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, url } = req.body;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const link = await Links.create({
      name,
      url,
      owner: req.userId,
    });

    return res.status(200).json({ success: true, link });
  } catch (error) {
    next(error);
  }
};

export const getAllLinks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const links = await Links.find({ owner: req.userId });

    const modifiedLinks = links.map((link) => ({
      _id: link._id,
      name: link.name,
      publish: link.publish,
      url: link.url,
      image: link.image ? checkUrlImage(req, link.image) : "",
    }));

    return res.status(200).json({ success: true, links: modifiedLinks });
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

export const deleteLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { linkId } = req.params;
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await Links.deleteOne({
      _id: linkId,
      owner: req.userId,
    });
    if (result.deletedCount > 0) {
      return res
        .status(200)
        .json({ success: true, message: "Link deleted successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const saveLinkImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.body;
    const fileName = req.file?.originalname;

    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const link = await Links.findById(_id);
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }

    if (link.image) {
      // Resolve the path relative to the root folder (not the current directory)
      const filePath = path.resolve("public", "images", link.image);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    }

    link.image = fileName;
    await link.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const removeImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.body;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const link = await Links.findById(id);
    if (!link) {
      return res
        .status(404)
        .json({ success: false, message: "Link not found" });
    }
    if (link.image) {
      // Resolve the path relative to the root folder (not the current directory)
      const filePath = path.resolve("public", "images", link.image);

      // Check if the file exists and delete it
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
      }
    }

    link.image = "";
    await link.save();
    return res
      .status(200)
      .json({ success: true, message: "Image removed successfully" });
  } catch (error) {
    next(error);
  }
};
