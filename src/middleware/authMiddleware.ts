import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.cookies.token;
  // console.log("cookie", cookie);
  if (!cookie) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const userId = jwt.verify(
      cookie,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    if (!userId) {
      return res.status(401).json({ message: "unauthorized" });
    }

    req.userId = (userId as JwtPayload).id;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};
