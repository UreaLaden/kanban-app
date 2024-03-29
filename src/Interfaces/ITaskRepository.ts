import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITaskBoard } from "./ITaskBoard";
import { SubtaskDto } from "../Dtos/SubtaskDto";
import TaskboardDto from "../Dtos/TaskboardDto";
import { IColumn } from "./IColumn";

export interface ITaskManagementRepository {
  getAllBoards: () => Promise<ITaskBoard[]> | Error;
  getBoard: (boardId: string) => Promise<ITaskBoard | null | Error>;
  addBoard: (boardName: string, columns: string[]) => Promise<ITaskBoard>;
  updateBoard: (
    boardId: mongoose.Types.ObjectId,
    boardName: string,
    columnNames: string[]
  ) => void;
  deleteBoard: (boardId: string) => Promise<void>;

  getAllTasks: (boardId: string) => Promise<TaskDto[]> | Error;
  addTask: (boardId: string, task: TaskDto) => Promise<mongoose.Types.ObjectId>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updatedTask: TaskDto) => void;

  addColumn: (
    boardId: mongoose.Types.ObjectId,
    columnName: string | string[]
  ) => Promise<mongoose.Types.ObjectId[]>;
  deleteColumn: (columnId: mongoose.Types.ObjectId) => Promise<void>;
  updateColumn: (
    columnId: mongoose.Types.ObjectId,
    column: IColumn
  ) => Promise<mongoose.Types.ObjectId>;

  addSubtask: (
    taskId: mongoose.Types.ObjectId,
    updatedSubtask: SubtaskDto
  ) => Promise<mongoose.Types.ObjectId>;
  deleteSubtask: (subtaskId: mongoose.Types.ObjectId) => Promise<void>;
  updateSubtask: (
    subtaskId: mongoose.Types.ObjectId,
    updatedSubtask: SubtaskDto
  ) => Promise<mongoose.Types.ObjectId>;
}
