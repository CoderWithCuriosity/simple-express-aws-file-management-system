import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
//   console.error("🔥 ERROR:", err);

  // default values
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Multer error handling
  if (err.code === "LIMIT_FILE_SIZE") {
    statusCode = 400;
    message = "File too large";
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    statusCode = 400;
    message = "Too many files uploaded";
  }

  return res.status(statusCode).json({
    success: false,
    message
  });
};