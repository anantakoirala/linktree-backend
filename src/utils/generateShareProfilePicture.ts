import { Request } from "express";
import puppeteer from "puppeteer";
import { getBaseUrl } from "./getBaseUrl";
import path from "path";
import fs from "fs";

export const generateShareProfilePic = async (
  req: Request,
  profile_title: string | null = "",
  username: string | null = "",
  image: string | null = "",
  backgroundColor: string = "",
  textColor: string
) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // Set the viewport size to 1200x630
    await page.setViewport({ width: 1200, height: 630 });

    const imagePath = getBaseUrl(req, `/static/${image}`);
    console.log("imagePath", backgroundColor);
    // Check if the file exists
    const image_path = path.resolve(
      "public",
      "images",
      "profile",
      username as string
    );
    if (fs.existsSync(image_path)) {
      // Delete the file
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting the image:", err);
        } else {
          console.log("Image deleted successfully!");
        }
      });
    }
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
                class="w-full h-screen flex items-center justify-center bg-green-700 "
              >
                <div class="imageDiv w-[1200px] h-[630px] ${backgroundColor} flex flex-col">
                  <div class="w-full h-[55%] flex items-center justify-center mt-5">
                    <!-- image -->
                    <span
                      class="flex shrink-0 overflow-hidden rounded-full size-56 cursor-pointer"
                    >
                      <img
                        src=${imagePath}
                        class="w-full h-full object-cover"
                        alt=""
                      />
                    </span>
                  </div>
                  <div
                    class="w-full h-auto flex ${textColor} items-center justify-center text-center font-[900] text-[55px]"
                  >
                    ${profile_title ? profile_title : username}
                  </div>
                  <div
                    class="w-full h-auto flex ${textColor} items-center justify-center tracking-tighter text-center  font-[700] text-[35px]"
                  >
                    /${username}
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

    const buffer = await imageDiv?.screenshot({
      type: "jpeg",
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    if (buffer) {
      // Define the path to save the image relative to the project root
      const imagesDir = path.resolve("public", "profile");

      // Ensure the 'images' directory exists
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }

      // Define the path to the image
      const imagePath = path.join(imagesDir, `/${username}.jpeg`);

      // Save the image to the 'public/images' folder
      fs.writeFileSync(imagePath, buffer);
      return imagePath;
    }
  } catch (error) {
    throw error;
  }
};
