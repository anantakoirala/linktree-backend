import { Request, Response, NextFunction } from "express";

import { authToken, refreshtToken } from "../utils/getSignedToken";
import { generateCookie } from "../utils/generateCookie";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User";
import { getBaseUrl } from "../utils/getBaseUrl";
import mongoose from "mongoose";
import Setting from "../models/setting";
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ success: false, message: "not found" });
    }
    const token = authToken(user.id.toString());
    const refresh_token = refreshtToken(user.id.toString());
    generateCookie(res, token, refresh_token);

    return res
      .status(200)
      .json({ success: "true", message: "login successfull" });
  } catch (error) {
    next(error); // Passes the error to the Express error handler
  }
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await mongoose.startSession();
  session.startTransaction(); // Start the transaction once

  try {
    const body = req.body;

    // Check if the username or email already exists
    const checkUniqueUser = await User.findOne(
      {
        $or: [
          { username: body.username }, // Check if the username exists
          { email: body.email }, // Check if the email exists
        ],
      },
      null,
      { session }
    );

    if (checkUniqueUser) {
      const isUsernameTaken = checkUniqueUser.username === body.username;
      const isEmailTaken = checkUniqueUser.email === body.email;

      // Abort the transaction if the user already exists
      await session.abortTransaction();
      session.endSession();

      let message = "Conflict: ";
      if (isUsernameTaken && isEmailTaken) {
        message += "Username and Email already exist";
      } else if (isUsernameTaken) {
        message += "Username already exists";
      } else if (isEmailTaken) {
        message += "Email already exists";
      }

      return res.status(409).json({
        success: false,
        message,
      });
    }

    // Create the new user within the transaction
    const [newUser] = await User.create([body], { session });

    // Create the user setting within the transaction
    await createSetting(newUser._id.toString(), session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json({ success: true, message: "registered successfully" });
  } catch (error) {
    console.error("Error in register:", error);

    // Abort the transaction in case of any error
    await session.abortTransaction();
    session.endSession();

    next(error);
  }
};

export const generateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refresh_token = req.cookies.refresh_token;
  if (!refresh_token) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  try {
    const decodedRefreshToken = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    if (!decodedRefreshToken) {
      return res.status(403).json({ message: "invalid refresh token" });
    }

    const userId = (decodedRefreshToken as JwtPayload).id; // Extract the `id` from the decoded token

    // Ensure `findUnique` uses the correct syntax
    // const user = await db.user.findUnique({
    //   where: { id: userId.toString() },
    // });
    const user = await User.findById(userId.toString());

    if (!user) {
      res.clearCookie("token");
      res.clearCookie("refresh_token");
      return res.status(404).json({ message: "User not found" });
    }

    const token = authToken(userId.toString());
    const refreshToken = refreshtToken(userId.toString());
    generateCookie(res, token, refreshToken);
    return res.status(200).json({ success: true, refreshToken, token });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const me = async (req: Request, res: Response) => {
  const loggedInUser = await User.findById(req.userId).select(
    "username email image name theme profile_title bio"
  );

  // const user = await User.findById(req.userId);
  if (!loggedInUser) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const user = {
    ...loggedInUser.toObject(),
    profile_title: loggedInUser?.profile_title
      ? loggedInUser.profile_title
      : loggedInUser?.username,
    image: loggedInUser?.image
      ? getBaseUrl(req, `/static/${loggedInUser?.image}`)
      : "",
  };

  return res.status(200).json({ message: "succces", user });
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("token");
    // res.clearCookie("token", {
    //   path: "/",
    //   httpOnly: true,
    //   domain: process.env.COOKIE_DOMAIN, // or the appropriate domain for your frontend
    //   secure: true,
    //   sameSite: "none",
    // });
    return res
      .status(200)
      .json({ success: "true", message: "logout succcessfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createSetting = async (
  user_id: string,
  session: mongoose.ClientSession
) => {
  await Setting.create(
    [
      {
        owner: user_id,
        social_icon_position: "Top",
      },
    ],
    { session } // Pass the session here
  );
};
