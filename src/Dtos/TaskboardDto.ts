import {
  IsString,
  IsMongoId,
  IsArray,
} from "class-validator";
import mongoose from "mongoose";

class TaskboardDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsArray()
  @IsMongoId({ each: true })
  columns: mongoose.Types.ObjectId[];

  constructor(name: string, columns: mongoose.Types.ObjectId[] = []) {
    this.id = "";
    this.name = name;
    this.columns = columns;
  }
}
export default TaskboardDto;
