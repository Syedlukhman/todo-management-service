const mongoose = require("mongoose");
const url = "mongodb://mongo_db:27017/todo_app_db";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // 30 seconds
  })
  .then(() => {
    console.log("DB created successfully");
  })
  .catch((err: Error) => {
    console.log(err, "DB not created");
  });

const todoList = new mongoose.Schema(
  {
    id: Number,
    title: String,
    status: String,
    clientId: Number,
  },
  { _v: false }
);

const TodoModel = mongoose.model("todos", todoList);

export default TodoModel;
