import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITask } from "./ITask";
import { ITaskBoard } from "./ITaskBoard";
import TaskboardDto from "../Dtos/TaskboardDto";

export interface ITaskManagementService {
  getBoards: () => Promise<ITaskBoard[] | Error>;
  getBoard: (boardId: string) => Promise<ITaskBoard | null | Error>;
  getTasks: (boardId: string) => Promise<TaskDto[] | Error>;
  addTask: (boardId: string, task: TaskDto) => Promise<mongoose.Types.ObjectId>;
  addBoard: (
    boardName: string,
    columnNames: string[]
  ) => Promise<TaskboardDto | Error>;
  deleteTask: (taskId: string) => void;
  deleteBoard: (boardId: string) => void;
  updateTask: (taskId: string, task: TaskDto) => void;
  getTaskById: (taskId: string) => Promise<TaskDto>;
  updateBoard: (
    boardId: string,
    boardName: string,
    columnNames: string[]
  ) => Promise<ITaskBoard>;
}
