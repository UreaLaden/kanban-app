import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsMongoId,
  IsArray,
} from "class-validator";
import { ISubtask } from "../Interfaces/ISubtask";
import { SubtaskDto } from "./SubtaskDto";

export class TaskDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsIn(["Todo", "Doing", "Done", ""])
  status: "Todo" | "Doing" | "Done" | "";

  @IsArray()
  @IsMongoId({ each: true })
  subtasks: SubtaskDto[];

  @IsNotEmpty()
  @IsMongoId()
  column: string;

  constructor(
    title: string,
    description: string,
    column: string,
    subtasks = []
  ) {
    this.id = "",
    this.title = title;
    this.description = description;
    this.subtasks = subtasks;
    this.column = column;
    this.status = "Todo";
  }
}
