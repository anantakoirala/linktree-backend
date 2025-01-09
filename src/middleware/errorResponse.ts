import { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  name: string;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: string;
  code?: number; // Specific to MongoDB (e.g., Duplicate Key error)
  keyValue?: Record<string, any>; // MongoDB duplicate key information
}

function errorResponse(
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error:", error); // Log error for debugging purposes

  // Default error response
  let statusCode = error.statusCode || 500;
  let message = "Something went wrong!";

  // Handle MongoDB Validation Error (e.g., Mongoose)
  if (error.name === "ValidationError" && error.errors) {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Handle MongoDB Duplicate Key Error (E11000)
  if (error.code === 11000 && error.keyValue) {
    statusCode = 400;
    const field = Object.keys(error.keyValue).join(", ");
    message = `Duplicate value for field: ${field}. Please use a unique value.`;
  }

  // Handle MongoDB CastError (e.g., invalid ObjectId)
  if (error.name === "CastError" && error.path && error.value) {
    statusCode = 400;
    message = `Invalid value '${error.value}' for field '${error.path}'.`;
  }

  //   // Handle other specific errors (expand as needed)
  //   if (error.name === "JsonWebTokenError") {
  //     statusCode = 401;
  //     message = "Invalid token. Please log in again.";
  //   }

  //   if (error.name === "TokenExpiredError") {
  //     statusCode = 401;
  //     message = "Token has expired. Please log in again.";
  //   }

  //   if (error.name === "UnauthorizedError") {
  //     statusCode = 403;
  //     message = "You are not authorized to perform this action.";
  //   }

  // Return a structured JSON response
  return res.status(statusCode).json({
    status: "error",
    name: error.name,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }), // Include stack trace in development
  });
}

export default errorResponse;
