import { NextFunction, Request, Response } from "express";
import SocialIcon from "../models/SocialIcon";

export const saveSocialIcons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("body", req.body);
    const { name, value } = req.body;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await SocialIcon.create({ name, value, owner: req.userId });
    return res
      .status(200)
      .json({ success: true, message: "Social icon saved successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllIcons = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const icons = await SocialIcon.find({ owner: req.userId }).select("-owner");

    return res.status(200).json({ success: true, icons });
  } catch (error) {
    next(error);
  }
};

export const updateSocialIconStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { socialIconId } = req.params;
    const { publish } = req.body;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const isSocialIconAvailable = await SocialIcon.findOne({
      owner: req.userId,
      _id: socialIconId,
    });

    if (!isSocialIconAvailable) {
      return res
        .status(404)
        .json({ success: false, message: "Social icon not found" });
    }
    const result = await SocialIcon.findByIdAndUpdate(
      isSocialIconAvailable._id, // Find by ID
      { $set: { publish: publish } },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Failed to update social icon status",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Publish status updated successfully" });
  } catch (error) {
    next(error);
  }
};
export const getSingleSocialIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { socialIconId } = req.params;
    console.log("id", socialIconId);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const socialIcon = await SocialIcon.findOne({
      _id: socialIconId,
      owner: req.userId,
    });

    if (!socialIcon) {
      return res.status(404).json({ success: false, message: "Nof found" });
    }

    return res.status(200).json({ success: true, socialIcon });
  } catch (error) {}
};

export const updateSocialIcon = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { socialIconId } = req.params;
    const { data } = req.body;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const isSocialIconAvailable = await SocialIcon.findOne({
      owner: req.userId,
      _id: socialIconId,
    });

    if (!isSocialIconAvailable) {
      return res
        .status(404)
        .json({ success: false, message: "Social icon not found" });
    }

    const result = await SocialIcon.findByIdAndUpdate(
      isSocialIconAvailable._id, // Find by ID
      { $set: { value: data.value } },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Failed to update social icon status",
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Social icon updated successfully" });
  } catch (error) {
    next(error);
  }
};
