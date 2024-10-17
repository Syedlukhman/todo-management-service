import express, { NextFunction, Request, Response } from "express";
import auth from "./middlewares/middleware";
import bodyParser from "body-parser";
import { ObjectId } from "mongodb";
import db from "./services/dataLayer";
import _ from "lodash";
import cors from "cors";
import { errorHandler, errorConverter } from "./middlewares/customError";
import DataLayer from "./services/dataLayer";

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

// Route to get a specific Todo by ID
app.get(
  "/getTodo/:id",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { client } = req; // Access the client injected by auth middleware
      const { id } = req.params; // Get the Todo ID from request parameters
      let todo = {};

      if (client.todos?.length) {
        // Find the Todo by its ID in the client's Todo list
        const getTodo = _.find(
          client.todos,
          (todo) => todo._id.toString() === id
        );
        const { _id, ...rest } = getTodo;
        todo = {
          id: _id, // Map the _id to id
          ...rest,
        };
      }
      res.send(todo); // Send the Todo
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to get all Todos for a client
app.get(
  "/getTodosList",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { client } = req; // Access the client injected by auth middleware
      const todos = client.todos.map((todo: any) => {
        const { _id, ...rest } = todo;
        return {
          id: _id, // Map the _id to id
          ...rest,
        };
      });
      res.status(200).send(todos); // Send the list of Todos
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to add a new Todo or create a new client
app.post(
  "/addTodo",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { todos } = req.body; // Get new Todos from the request body
      const { authorization } = req.headers;
      const clientId = authorization?.split("=")[1]; // Extract clientId from Authorization header

      const iDl = new DataLayer({ clientId }); // Initialize DataLayer with clientId
      const client = await iDl.findOne(); // Find client in the database

      if (client) {
        // If client exists, update their Todo list
        client.todos = [...client?.todos, ...todos]; // Append new Todos
        const updatedResult = await iDl.updateOne({ clientId }, client); // Update client data in the DB
        res.status(200).send(updatedResult);
        return;
      }

      // If client doesn't exist, create a new client
      const newObj = {
        clientId,
        todos,
      };

      const newClient = await iDl.insertOne(newObj); // Insert new client
      const newTodos = newClient.todos.map((client: any) => {
        const { _id, ...rest } = client;
        return {
          id: _id,
          ...rest,
        };
      });
      res.status(200).send(newTodos); // Send new Todos
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
      const { client, iDl } = req; // Access the client and DataLayer
      const { status, title } = req.body; // Get updated fields from request body
      const { clientId } = client;
      const updateObj = {
        $set: {},
      };
      const id = req.params.id; // Get the Todo ID

      // Add status update if present
      if (status) {
        _.assign(updateObj.$set, {
          "todos.$[todo].status": status,
        });
      }

      // Add title update if present
      if (title) {
        _.assign(updateObj.$set, {
          "todos.$[todo].title": title,
        });
      }

      if (!client) {
        res.send(`Client not found!`);
        return;
      }

      // Update the Todo in the database
      const updatedResult = await iDl.updateOne({ clientId }, updateObj, [
        {
          "todo._id": new ObjectId(id),
        },
      ]);
      res.status(200).send(updatedResult); // Send the updated result
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to delete a specific Todo by its ID
app.delete(
  "/deleteTodo/:id",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.client; // Access clientId from the request
      const { iDl } = req;
      const id = req.params.id; // Get the Todo ID
      await iDl.updateOne(
        { clientId },
        {
          $pull: { todos: { _id: new ObjectId(id) } }, // Remove the Todo with the given ID
        }
      );
      res.status(200).send("Deleted Todo Successfully!"); // Send success message
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to delete all Todos for a client
app.delete(
  "/deleteTodos",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clientId } = req.client; // Access clientId from the request
      const { iDl } = req;
      const deleteAllTodos = await iDl.updateOne(
        { clientId },
        { $set: { todos: [] } } // Set the todos array to empty
      );
      res.status(200).send(deleteAllTodos); // Send the result
    } catch (error) {
      return next(error); // Pass error to the error handling middleware
    }
  }
);

// Route to delete a client
app.delete(
  "/deleteClient",
  auth, // Middleware to authorize the user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { client, iDl } = req; // Access the client and DataLayer
      const { clientId } = client;
      await iDl.deleteOne({ clientId }); // Delete the client
      res.status(200).send("Client Deleted Successfully"); // Send success message
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
