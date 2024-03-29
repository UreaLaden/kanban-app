import mongoose from "mongoose";
import { Document } from "mongoose";

export interface ITaskBoard extends Document{
  name: string;
  columns: mongoose.Types.ObjectId[];
}
