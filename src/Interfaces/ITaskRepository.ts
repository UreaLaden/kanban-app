import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITaskBoard } from "./ITaskBoard";
import { SubtaskDto } from "../Dtos/SubtaskDto";
import TaskboardDto from "../Dtos/TaskboardDto";
import { IColumn } from "./IColumn";
import { ITask } from "./ITask";
import { ISubtask } from "./ISubtask";
import { ColumnDto } from "../Dtos/ColumnDto";

export interface ITaskManagementRepository {
  getAllBoards: () => Promise<ITaskBoard[]> | Error;
  getBoard: (boardId: string) => Promise<TaskboardDto | null | Error>;
  addBoard: (boardName: string, columns: string[]) => Promise<ITaskBoard>;
  updateBoard: (
    boardId: mongoose.Types.ObjectId,
    boardName: string,
    columnNames: string[]
  ) => Promise<ITaskBoard>;
  deleteBoard: (boardId: string) => Promise<void>;

  getAllTasks: (boardId: string) => Promise<TaskDto[]> | Error;
  getTask: (taskId: string) => Promise<ITask>;
  addTask: (boardId: string, task: TaskDto) => Promise<mongoose.Types.ObjectId>;
  deleteTask: (taskId: string) => Promise<void>;
  updateTask: (taskId: string, updatedTask: TaskDto) => void;

  addColumn: (
    boardId: mongoose.Types.ObjectId,
    columnName: string | string[]
  ) => Promise<ColumnDto[]>;
  getColumn: (columnId: string) => Promise<ColumnDto> | Error;
  getAllColumns: (taskboardId: string) => Promise<ColumnDto[]>;
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
  getSubtask: (subtaskId: mongoose.Types.ObjectId) => Promise<ISubtask>;
  getAllSubtasks: (task: ITask) => Promise<SubtaskDto[]>;
}
