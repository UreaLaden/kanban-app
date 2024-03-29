import mongoose, { Document } from "mongoose";

export interface IColumn extends Document {
  name: string;
  tasks: mongoose.Types.ObjectId[];
  taskBoard: mongoose.Types.ObjectId;
}
