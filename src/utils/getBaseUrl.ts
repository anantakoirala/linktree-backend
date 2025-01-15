import { Request } from "express";

export const getBaseUrl = (req: Request, path: string = ""): string => {
  return `${req.protocol}://${req.get("host")}${path}`;
};
