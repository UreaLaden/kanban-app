import mongoose, { Document } from "mongoose";

export interface ISubtask extends Document {
  title: string;
  isCompleted: boolean;
  task: mongoose.Types.ObjectId;
}
