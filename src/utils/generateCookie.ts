import { Response } from "express";

export const generateCookie = (
  res: Response,
  token: string,
  refresh_token: string
) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    domain: isDevelopment ? "localhost" : undefined, // Domain only for development
    secure: !isDevelopment, // Secure is true in production
    sameSite: isDevelopment ? "lax" : "none", // sameSite depends on environment
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    path: "/",
    domain: isDevelopment ? "localhost" : undefined, // Domain only for development
    secure: !isDevelopment, // Secure is true in production
    sameSite: isDevelopment ? "lax" : "none", // sameSite depends on environment
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
};
