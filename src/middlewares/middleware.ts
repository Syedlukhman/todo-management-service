import express, { Request, Response, NextFunction } from "express";
import _ from "lodash";
import ApiError from "../utils/ApiError";
import httpStatus from "http-status";
import DataLayer from "../services/dataLayer";
import { ObjectId } from "mongodb";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers; // Extract the authorization header from the request
    const clientId = authorization?.split("=")[1]; // Parse the clientId from the authorization header
    const iDl = new DataLayer(clientId); // Create an instance of DataLayer with the clientId
    req.iDl = iDl; // Attach the DataLayer instance to the request object for further use
    let filter = {};
    const { id } = req.params;
    if (id) {
      filter = { _id: new ObjectId(id) };
    }
    const todo = await iDl.findOne(filter); // Attempt to find the todo with client id in the database

    if (!todo) {
      return next(
        // If the todo is not found, throw an error
        new ApiError(
          httpStatus.NOT_FOUND,
          "Client has no Todos or Todo with given id",
          "NOT_FOUND"
        )
      );
    }
    req.todo = todo;
    return next(); // Proceed to the next middleware or route handler
  } catch (error: any) {
    return next(error); // If an error occurs, pass it to the error handling middleware
  }
};

export default auth; // Export the auth middleware for use in other parts of the application
