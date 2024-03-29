import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITask } from "./ITask";
import { ITaskBoard } from "./ITaskBoard";

export interface ITaskManagementService {
  getBoards: () => Promise<ITaskBoard[] | Error>;
  getBoard: (boardId: string) => Promise<ITaskBoard | null | Error>;
  getTasks: (boardId: string) => Promise<TaskDto[] | Error>;
  addTask: (boardId: string, task: TaskDto) => Promise<mongoose.Types.ObjectId>;
  addBoard: (board: ITaskBoard) => void;
  deleteTask: (taskId: string) => void;
  deleteBoard: (boardId: string) => void;
  updateTask: (taskId: string, task: ITask) => void;
  updateBoard: (boardId: string, board: ITaskBoard) => void;
}