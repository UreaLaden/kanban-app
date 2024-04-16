import {
  IsString,
  IsMongoId,
  IsArray,
} from "class-validator";
import mongoose from "mongoose";
import { ColumnDto } from "./ColumnDto";

class TaskboardDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  columns: ColumnDto[];

  constructor(name: string, columns: ColumnDto[] = []) {
    this.id = "";
    this.name = name;
    this.columns = columns;
  }
}
export default TaskboardDto;
