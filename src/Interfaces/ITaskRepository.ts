import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITaskBoard } from "./ITaskBoard";

export interface ITaskManagementRepository {
  getAllBoards: () => Promise<ITaskBoard[]> | Error;
  getBoard: (boardId: string) => Promise<ITaskBoard | null | Error>;
  addBoard: (boardName: string, columns: string[]) => Promise<ITaskBoard>;
  updateBoard: (boardId: string) => void;
  deleteBoard: (boardId: string) => Promise<void>;

  getAllTasks: (boardId: string) => Promise<TaskDto[]> | Error;
  addTask: (boardId: string, task: TaskDto) => Promise<mongoose.Types.ObjectId>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string) => void;

  addColumn: (
    boardId: mongoose.Types.ObjectId,
    columnName: string | string[]
  ) => Promise<mongoose.Types.ObjectId[]>;
}
