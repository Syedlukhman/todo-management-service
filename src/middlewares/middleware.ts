import express, { Request, Response, NextFunction } from "express";
import db from "../services/dataLayer"; // Import the data access layer (not used in this middleware)
import _ from "lodash"; // Import Lodash for utility functions (not used in this middleware)
import bodyParser from "body-parser"; // Import body-parser middleware (not used in this middleware)
import ApiError from "../utils/ApiError"; // Import custom error class for API errors
import httpStatus from "http-status"; // Import HTTP status codes for easier management
import DataLayer from "../services/dataLayer"; // Import the data access layer for database interactions

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers; // Extract the authorization header from the request
    const clientId = authorization?.split("=")[1]; // Parse the clientId from the authorization header

    const iDl = new DataLayer({ clientId }); // Create an instance of DataLayer with the clientId
    req.iDl = iDl; // Attach the DataLayer instance to the request object for further use

    const client = await iDl.findOne(); // Attempt to find the client in the database

    if (!client) {
      return next(
        // If the client is not found, throw an error
        new ApiError(httpStatus.NOT_FOUND, "Client Not Found", "NOT_FOUND")
      );
    }

    req.client = client; // Attach the found client to the request object for later use in route handlers
    return next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    return next(error); // If an error occurs, pass it to the error handling middleware
  }
};

export default auth; // Export the auth middleware for use in other parts of the application
