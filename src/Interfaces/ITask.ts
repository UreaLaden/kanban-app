import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string | null;
  status?: "Todo" | "Doing" | "Done" | "";
  subtasks: mongoose.Types.ObjectId[];
  column: mongoose.Types.ObjectId;
}
