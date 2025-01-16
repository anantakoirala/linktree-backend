import { NextFunction, Request, Response } from "express";
import * as cheerio from "cheerio";
import axios from "axios";
import Product from "../models/Product";
import { getBaseUrl } from "../utils/getBaseUrl";

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
    const userProducts = await Product.find({ owner: req.userId }).select(
      "name image publish"
    );

    const products = userProducts.map((product) => ({
      _id: product._id,
      name: product.name,
      image: product.image ? checkUrlImage(req, product.image) : "",
      publish: product.publish,
    }));
    return res.status(200).json({ success: true, products });
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

export const saveCustomProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const { title, url, price } = req.body;
    const fileName = req.file?.originalname;
    const product = await Product.create({
      name: title,
      price: price,
      url: url,
      image: fileName,
      owner: req.userId,
    });
    return res
      .status(200)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    next(error);
  }
};

export const changeProductStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { status } = req.body;
    console.log("status", req.body);
    console.log("productId", productId);
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const availabilityOfProduct = await Product.findOne({
      owner: req.userId,
      _id: productId,
    });
    if (!availabilityOfProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const product = await Product.findByIdAndUpdate(
      productId, // Find by ID
      { $set: { publish: status } },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Failed to update product status" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Status successfully updated" });
  } catch (error) {
    next(error);
  }
};
