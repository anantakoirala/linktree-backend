import { NextFunction, Request, Response } from "express";
import * as cheerio from "cheerio";
import axios from "axios";
import Product from "../models/Product";

export const fetchOg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url } = req.query;
  try {
    const { data: html } = await axios.get(url as string);
    const $ = cheerio.load(html);

    // Look for both property and name attributes
    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="og:title"]').attr("content") ||
      "No title";

    const ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="og:image"]').attr("content") ||
      "No image";

    console.log("ogTitle", ogTitle);
    res.json({ ogTitle, ogImage });
  } catch (error) {
    next(error);
  }
};

export const saveProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { ogTitle, ogImage } = req.body;
    const product = await Product.create({
      name: ogTitle,
      image: ogImage,
      owner: req.userId,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const products = await Product.find({ owner: req.userId }).select(
      "name image publish"
    );

    return res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};
