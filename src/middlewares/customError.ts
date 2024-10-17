import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError"; // Custom API error class
import httpStatus from "http-status";

// Middleware to convert generic errors into ApiError instances
const errorConverter = (
  error: any, // The error that occurred
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // If the error is already an instance of ApiError, pass it to the next middleware
  if (error instanceof ApiError) {
    return next(error);
  }

  // If not an ApiError, create a new ApiError with default values
  const statusCode = httpStatus.INTERNAL_SERVER_ERROR; // Default status code (500)
  const message = error.message || httpStatus[statusCode]; // Error message or default HTTP status text
  const messageCode = "UNEXPECTED_ERROR"; // Custom message code for unexpected errors

  // Pass the new ApiError to the next middleware
  return next(new ApiError(statusCode, message, messageCode, error.stack));
};

// Middleware to handle errors and send the response
const errorHandler = (
  err: ApiError, // The error that needs to be handled
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode, message, messageCode, stack } = err; // Destructure properties from the ApiError

  // Construct the error response object
  const response = {
    status: statusCode, // The HTTP status code
    message, // The error message
    stack, // The stack trace (useful for debugging, often hidden in production)
  };

  // Send the error response with the appropriate HTTP status code
  res.status(statusCode).send(response);
};

// Export both middlewares for use in other parts of the app
export { errorHandler, errorConverter };
