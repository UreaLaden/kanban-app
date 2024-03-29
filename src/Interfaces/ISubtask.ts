import mongoose, { Document } from "mongoose";
import { SubtaskDto } from "../Dtos/SubtaskDto";

export interface ISubtask extends Document {
  title: string;
  isCompleted: boolean;
  task: mongoose.Types.ObjectId;
}

export interface SubtaskMap {
  [key: string]: SubtaskDto[];
}