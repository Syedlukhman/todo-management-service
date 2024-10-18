import express, { NextFunction, Request, Response } from "express";
import auth from "./middlewares/middleware";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import _ from "lodash";
import cors from "cors";
import { errorHandler, errorConverter } from "./middlewares/customError";
import DataLayer from "./services/dataLayer";
import ApiError from "./utils/ApiError";
import httpStatus from "http-status";

const app = express();
app.use(express.json());

// CORS options allowing all origins, methods, and Authorization headers
const options = {
  origin: "*",
  methods: "*",
  allowedHeaders: ["Authorization"],
};

// Middleware to handle CORS, body parsing, and JSON parsing
app.use(cors(options));
app.use(bodyParser.json());
app.use(express.json());

// Route to add a new Todo or create a new todo
app.post(
  "/addTodo",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { todo } = req.body; // Get new Todos from the request body
      console.log(todo);
      const { authorization } = req.headers;
      const clientId = authorization?.split("=")[1]; // Extract clientId from Authorization header
      const iDl = new DataLayer({ clientId }); // Initialize DataLayer with clientId

      const newObj = {
        clientId,
        ...todo,
      };
      console.log(newObj);

      const newTodo = await iDl.insertOne(newObj); // Insert new todo
      const { _id, ...rest } = todo;

      res.status(200).send({
        id: _id,
        ...rest,
      }); // Send new Todo
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to get a specific Todo by ID
app.get(
  "/getTodo/:id",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params; // Get the Todo ID from request parameters
      const { iDl, todo } = req;

      if (!todo) {
        throw new ApiError(httpStatus.NOT_FOUND, "Todo Not Found", "NOT_FOUND");
      }
      const { _id, ...rest } = todo;

      res.status(200).send({
        id: _id,
        ...rest,
      }); // Send the Todo
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to get all Todos for a todo
app.get(
  "/getTodosList",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { iDl } = req; // Access the todo injected by auth middleware
      let todos = await iDl.findMany();
      todos = todos.map((todo: any) => {
        const { _id, ...rest } = todo;
        return {
          id: _id,
          ...rest,
        };
      });
      res.status(200).send(todos); // Send the list of Todos
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to update an existing Todo by its ID
app.put(
  "/updateTodo/:id",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { iDl } = req; // Access to DataLayer
      const id = req.params.id; // Get the Todo ID

      const { status, title } = req.body; // Get updated fields from request body
      const updateObj = {
        $set: {},
      };

      // Add status update if present
      if (status) {
        _.assign(updateObj.$set, {
          status,
        });
      }

      // Add title update if present
      if (title) {
        _.assign(updateObj.$set, {
          title,
        });
      }

      // Update the Todo in the database
      const updatedResult = await iDl.updateOne(
        { _id: new ObjectId(id) },
        updateObj
      );
      res.status(200).send(updatedResult); // Send the updated result
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// // Route to delete a specific Todo by its ID
app.delete(
  "/deleteTodo/:id",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { iDl } = req;
      const { id } = req.params;
      const deleteTodo = await iDl.deleteOne({ _id: new ObjectId(id) });
      res.status(200).send("Deleted Todo Successfully!"); // Send success message
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// // Route to delete all Todos for a client
app.delete(
  "/deleteTodos",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { iDl } = req;
      const { status, title } = req.query;
      const filter: any = {};
      if (status) {
        filter.status = status;
      }
      if (title) {
        filter.title = title;
      }
      const deleteTodos = await iDl.deleteMany(filter);

      res.status(200).send("Deleted Todos successfully"); // Send the result
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Start the server
app.listen(9000, () => {
  console.log(`Server started on ${"http://localhost:9000"}`);
});

// Use error handling middleware
app.use(errorConverter); // Converts generic errors to ApiError instances
app.use(errorHandler); // Custom error handler that returns error responses
