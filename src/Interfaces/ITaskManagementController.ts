import { Request, Response } from "express";
2;
export interface ITaskManagementController {
  getTaskBoards: (request: Request, response: Response) => Promise<void>;
  getTaskBoard: (request: Request, response: Response) => Promise<void>;
  deleteTaskBoard: (request: Request, response: Response) => Promise<void>;

  getTasks: (request: Request, response: Response) => Promise<void>;
  addTask: (
    request: Request,
    response: Response
  ) => Promise<Response<any, Record<string, any>>>;
  deleteTask: (request: Request, response: Response) => Promise<void>;
}
