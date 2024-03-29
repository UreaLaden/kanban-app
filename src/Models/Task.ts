import mongoose from "mongoose";

const Schema = mongoose.Schema;
export const subtaskSchema = new Schema({
  title: { type: String, required: true },
  isCompleted: { type: Boolean, required: true },
  task: { type: mongoose.Types.ObjectId, ref: "Task" },
});

export const taskSchema = new Schema({
  title: { type: String, required: true },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
    enum: ["Todo", "Doing", "Done", ""],
  },
  subtasks: [{ type: mongoose.Types.ObjectId, ref: "Subtask" }],
  column: { type: mongoose.Types.ObjectId, ref: "Column" },
});

export const Task = mongoose.model("Task", taskSchema);
export const Subtask = mongoose.model("Subtask", subtaskSchema);
