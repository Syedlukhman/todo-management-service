import TodoModel from "../db/conn";
import _ from "lodash";
import httpStatus from "http-status";
import ApiError from "../utils/ApiError";

export default class DataLayer {
  clientId: any; // Class property to hold the filter criteria
  filter: any;

  constructor(clientId: any) {
    this.clientId = clientId; // Initialize the filter property with the provided filter
    this.filter = { clientId };
  }

  // Method to insert a new Todo
  async insertOne(todo: any) {
    const addNewTodo = new TodoModel(todo); // Create a new TodoModel instance
    const addedNewTodo = (await addNewTodo.save()).toObject(); // Save it to the database and convert to a plain object
    console.log(addedNewTodo);
    // Check if the todo object is empty
    if (Object.keys(addNewTodo).length == 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Adding ToDo failed"); // Throw an error if empty
    }

    return addedNewTodo; // Return the newly added todo
  }

  async findMany(filter: {} = {}) {
    filter = { ...filter, ...this.filter };
    const todos = await TodoModel.find(filter, { __v: 0 }).lean(); // Query the database and return a plain JavaScript object
    return todos;
  }
  // Method to find one todo based on the filter
  async findOne(filter: any = {}) {
    // Combine the provided filter with the class filter
    filter = { ...filter, ...this.filter };
    console.log(filter);
    const todo = await TodoModel.findOne(filter, { __v: 0 }).lean(); // Query the database and return a plain JavaScript object
    return todo; // Return the first matched todo or undefined if none found
  }

  // Method to update an existing todo
  async updateOne(filter: any, updateObj: any, arrayFilters: any = null) {
    filter = { ...filter, ...this.filter };

    const updatedObj = await TodoModel.updateOne(filter, updateObj, {
      arrayFilters, // Apply specified array filters.
    });

    // Check if the update operation was successful
    if (updatedObj.modifiedCount !== 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to update!"); // Throw an error if the update failed
    }

    return "Updated Todos List Successfully!"; // Return success message
  }

  // Method to delete a todo
  async deleteOne(filter: any) {
    filter = { ...filter, ...this.filter };
    const deleteTodo = await TodoModel.deleteOne(filter); // Delete the document matching the filter
    if (deleteTodo.deletedCount !== 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete!");
    }
    return deleteTodo; // Return the result of the delete operation
  }

  // Method to delete all todos
  async deleteMany(filter: any = {}) {
    filter = { ...filter, ...this.filter };
    const deleteTodo = await TodoModel.deleteMany(filter); // Delete the document matching the filter
    console.log(deleteTodo);
    if (deleteTodo.deletedCount == 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No Todos were to delete!");
    }
    return deleteTodo; // Return the result of the delete operation
  }
}
