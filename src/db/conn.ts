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
