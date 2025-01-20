import { NextFunction, Request, Response } from "express";
import User from "../models/User";
import path from "path";
import fs from "fs";
import { getBaseUrl } from "../utils/getBaseUrl";
import Links from "../models/Links";
import Product from "../models/Product";
import puppeteer from "puppeteer";
import { generateShareProfilePic } from "../utils/generateShareProfilePicture";

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
    const oldUser = await User.findOne({ _id: req.userId });
    if (!oldUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const imagePath = getBaseUrl(req, `/static/${oldUser?.image}`);
    if (fs.existsSync(imagePath)) {
      // Delete the file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting the image:", err);
        } else {
          console.log("Image deleted successfully!");
        }
      });
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

    generateShareProfilePic(
      req,
      updatedUser?.profile_title,
      updatedUser?.username,
      updatedUser?.image,
      updatedUser?.theme.shareLink_background[
        updatedUser.theme.selectedShareLinkBackgroundIndex
      ].background,
      updatedUser?.theme.shareLink_background[
        updatedUser.theme.selectedShareLinkBackgroundIndex
      ].textColor
    );

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

    generateShareProfilePic(
      req,
      updatedUser?.profile_title,
      updatedUser?.username,
      updatedUser?.image,
      updatedUser?.theme.shareLink_background[
        updatedUser.theme.selectedShareLinkBackgroundIndex
      ].background,
      updatedUser?.theme.shareLink_background[
        updatedUser.theme.selectedShareLinkBackgroundIndex
      ].textColor
    );

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
      shareImage: getBaseUrl(req, `/static/profile/${username}.jpeg`),
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

export const generateImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById({ _id: req.userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const username = "ananta";
    const bgColor = "bg-blue-600";
    const imagePath = getBaseUrl(req, `/static/unnamed.png`);
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <!-- Import the same fonts used in your Next.js project -->
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Special+Elite&display=swap"
            rel="stylesheet"
          />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            /* Apply the fonts to the body to match Next.js setup */
            body {
              font-family: "Inter", sans-serif;
            }
          </style>
        </head>
        <body class="font-[Inter]">
          <div
            class="w-full h-screen flex items-center justify-center bg-green-700 p-4"
          >
            <div class="imageDiv w-[90vw] h-96 bg-red-800 flex flex-col">
              <div class="w-full h-[55%] flex items-center justify-center mt-5">
                <!-- image -->
                <span
                  class="flex shrink-0 overflow-hidden rounded-full size-36 cursor-pointer"
                >
                  <img
                    src="http://localhost:7000/static/mhOzWfVX.jpeg"
                    class="w-full h-full object-cover"
                    alt=""
                  />
                </span>
              </div>
              <div
                class="w-full h-10 flex items-center justify-center text-center font-[900] text-[34px]"
              >
                @${user.profile_title ? user.profile_title : user.username}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    // Wait for the content to load and be rendered
    await page.waitForSelector(".imageDiv");

    // Get the element handle for 'imageDiv'
    const imageDiv = await page.$(".imageDiv");

    const buffer = await imageDiv?.screenshot({ type: "jpeg" });
    if (buffer) {
      // Define the path to save the image relative to the project root
      const imagesDir = path.resolve("public", "images", "profile");

      // Ensure the 'images' directory exists
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Define the path to the image
      const imagePath = path.join(imagesDir, "/generated-image.jpg");

      // Save the image to the 'public/images' folder
      fs.writeFileSync(imagePath, buffer);
      res.send(buffer);
    }
  } catch (error) {
    next(error);
  }
};

export const getMetaData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    console.log("username", username);
    const user = await User.findOne({ username: username });
    const newUser = {
      ...user,
      image: getBaseUrl(req, `/profile/${username}.jpeg`),
    };
    if (user) {
      return res.status(200).json({ success: true, newUser });
    } else {
      return res.status(404).json({ success: false });
    }
  } catch (error) {
    next(error);
  }
};
