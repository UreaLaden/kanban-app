import { Request, Response } from "express";
import TaskboardDto from "../Dtos/TaskboardDto";
2;
export interface ITaskManagementController {
  getTaskBoards: (request: Request, response: Response) => Promise<void>;
  getTaskBoard: (request: Request, response: Response) => Promise<void>;
  deleteTaskBoard: (request: Request, response: Response) => Promise<void>;
  addTaskBoard: (request: Request, response: Response) => Promise<void>;
  updateTaskBoard: (request: Request, response: Response) => Promise<void>;
  getTasks: (request: Request, response: Response) => Promise<void>;
  getTaskById: (request: Request, response: Response) => Promise<void>;
  addTask: (request: Request, response: Response) => Promise<void>;
  deleteTask: (request: Request, response: Response) => Promise<void>;
  updateTask: (request: Request, response: Response) => Promise<void>;
}
