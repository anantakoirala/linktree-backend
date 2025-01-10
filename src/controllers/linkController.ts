import { NextFunction, Request, Response } from "express";
import Links from "../models/Links";

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
    return res.status(200).json({ success: true, links });
  } catch (error) {
    next(error);
  }
};
