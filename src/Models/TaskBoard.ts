import mongoose, { Schema, model } from "mongoose";

export const taskBoardSchema = new Schema({
  name: { type: String, required: true },
  columns: [{ type: mongoose.Types.ObjectId, ref: "Column" }],
});

export const TaskBoard = model("TaskBoard", taskBoardSchema);
