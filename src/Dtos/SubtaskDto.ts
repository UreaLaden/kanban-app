import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsMongoId,
  IsArray,
  IsBoolean,
} from "class-validator";
import mongoose from "mongoose";

export class SubtaskDto{
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  isCompleted: boolean;

  @IsNotEmpty()
  @IsMongoId()
  task: mongoose.Types.ObjectId;

  constructor(id: string, title: string, isCompleted: boolean, task: string) {
    this.id = id;
    this.title = title;
    this.isCompleted = isCompleted;
    this.task = new mongoose.Types.ObjectId(task);
  }
}
