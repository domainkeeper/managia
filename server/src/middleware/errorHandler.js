import { env } from "../config/env.js";

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  if (env.NODE_ENV === "development" && !err.isOperational) {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === "development" && !err.isOperational && { stack: err.stack }),
  });
}
