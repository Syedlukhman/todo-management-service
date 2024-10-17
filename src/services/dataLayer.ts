import TodoModel from "../db/conn";
import _ from "lodash";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

export default class DataLayer {
  filter: any; // Class property to hold the filter criteria

  constructor(filter: any) {
    this.filter = filter; // Initialize the filter property with the provided filter
  }

  // Method to insert a new client (or Todo)
  async insertOne(client: any) {
    const addNewClient = new TodoModel(client); // Create a new TodoModel instance
    const addedNewTenant = (await addNewClient.save()).toObject(); // Save it to the database and convert to a plain object

    // Check if the client object is empty
    if (Object.keys(addNewClient).length == 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Adding ToDo failed"); // Throw an error if empty
    }

    return addedNewTenant; // Return the newly added client
  }

  // Method to find one client based on the filter
  async findOne(filter: {} = {}) {
    // Combine the provided filter with the class filter
    filter = { ...filter, ...this.filter };
    const clients = await TodoModel.find(filter).lean(); // Query the database and return a plain JavaScript object

    return clients[0]; // Return the first matched client or undefined if none found
  }

  // Method to update an existing client
  async updateOne(filter: any, updateObj: any, arrayFilters: any = null) {
    const updatedObj = await TodoModel.updateOne(filter, updateObj, {
      upsert: true, // Create a new document if no document matches the filter
      arrayFilters, // Apply specified array filters (if any)
      returnDocument: "after", // This option is not recognized by Mongoose; it's likely a confusion with MongoDB Driver options
    });
    // Check if the update operation was successful
    if (updatedObj.modifiedCount !== 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Operation Failed!"); // Throw an error if the update failed
    }

    return "Updated Todos List Successfully!"; // Return success message
  }

  // Method to delete a client
  async deleteOne(filter: any) {
    const deleteClient = await TodoModel.deleteOne(filter); // Delete the document matching the filter
    return deleteClient; // Return the result of the delete operation
  }
}
