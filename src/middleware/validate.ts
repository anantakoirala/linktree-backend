import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodEffects } from "zod";

// Middleware to validate request
export const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body (you can also validate query or params if needed)
      schema.parse(req.body);
      next();
    } catch (error: any) {
      return res.status(400).json({
        status: "error",
        name: "ValidationError",
        message: "Invalid input data",
        errors: error.errors.map((e: any) => ({
          path: e.path,
          message: e.message,
        })),
      });
    }
  };
