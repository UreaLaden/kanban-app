import { IsNotEmpty, IsString, IsMongoId, IsArray } from "class-validator";
import mongoose from "mongoose";
import { TaskDto } from "./TaskDto";

export class ColumnDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  tasks: TaskDto[];

  @IsNotEmpty()
  @IsMongoId()
  taskBoard: mongoose.Types.ObjectId;

  constructor(name: string, tasks: TaskDto[] = [], taskBoard: string) {
    this.id = "";
    this.name = name;
    this.tasks = tasks;
    this.taskBoard = new mongoose.Types.ObjectId(taskBoard);
  }
}
