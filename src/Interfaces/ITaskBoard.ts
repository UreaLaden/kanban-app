import mongoose from "mongoose";

export interface ITaskBoard {
  name: string;
  columns: mongoose.Types.ObjectId[];
}
