import mongoose, { Schema, model } from "mongoose";

export const columnSchema = new Schema({
  name: { type: String, required: true },
  tasks: [{ type: mongoose.Types.ObjectId, ref: "Task" }],
  taskBoard: { type: mongoose.Types.ObjectId, ref: "TaskBoard" },
});

export const Column = model("Column", columnSchema);
