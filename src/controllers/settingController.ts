import { NextFunction, Request, Response } from "express";
import Setting from "../models/setting";

export const editSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body;
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const setting = await Setting.findOne({ owner: req.userId });
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Not found setting" });
    }

    const updatedSetting = await Setting.findByIdAndUpdate(
      setting._id,
      {
        $set: data,
      },
      { new: true }
    );
    return res.status(200).json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};

export const getSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const setting = await Setting.findOne({ owner: req.userId });
    if (!setting) {
      return res
        .status(404)
        .json({ success: false, message: "Not found setting" });
    }
    return res.status(200).json({ success: true, setting });
  } catch (error) {
    next(error);
  }
};
