const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/SAP_LeanIX")
  .then(() => {
    console.log("DB created successfully");
  })
  .catch((err: Error) => {
    console.log(err, "DB not created");
  });

const todoListSchema = new mongoose.Schema(
  {
    id: Number,
    title: String,
    status: String,
  },
  { _v: false }
);
const todoList = new mongoose.Schema({
  clientId: Number,
  todos: [todoListSchema],
});

const TodoModel = mongoose.model("todos", todoList);

export default TodoModel;

// database.ts
// import { MongoClient } from "mongodb";

// const url = "mongodb://localhost:27017"; // Your MongoDB connection string
// const dbName = "SAP_LeanIX"; // Your database name
// const client = new MongoClient(url);

// export async function connect() {
//   try {
//     await client.connect();
//     console.log("Connected to database successfully");
//   } catch (err) {
//     console.error("Database connection failed:", err);
//   }
// }

// export const getDb = () => client.db(dbName);
