export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function notFoundError(resource) {
  return new AppError(`${resource} not found`, 404);
}

export function badRequestError(message) {
  return new AppError(message, 400);
}

export function unauthorizedError(message = "Unauthorized") {
  return new AppError(message, 401);
}

export function conflictError(message) {
  return new AppError(message, 409);
}
