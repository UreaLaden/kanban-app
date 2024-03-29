import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITask } from "../Interfaces/ITask";
import { ITaskBoard } from "../Interfaces/ITaskBoard";
import { ITaskManagementService } from "../Interfaces/ITaskManagementService";
import { ITaskManagementRepository } from "../Interfaces/ITaskRepository";
import TaskManagementRepository from "../Repositories/TaskRepository";

class TaskManagementService implements ITaskManagementService {
  private _taskManagementRepository: ITaskManagementRepository;

  constructor() {
    this._taskManagementRepository = new TaskManagementRepository();
  }
  getBoard = async (boardId: string): Promise<ITaskBoard | null | Error> => {
    try {
      const board = await this._taskManagementRepository.getBoard(boardId);
      return board;
    } catch (error) {
      throw new Error("Unable to query the DB");
    }
  };

  getBoards = async (): Promise<Error | ITaskBoard[]> => {
    try {
      const boards = await this._taskManagementRepository.getAllBoards();
      return boards;
    } catch (error) {
      throw new Error("Unable to query the db");
    }
  };
  
  addBoard = (board: ITaskBoard) => {};

  deleteBoard = async (boardId: string) => {
    try {
      return await this._taskManagementRepository.deleteBoard(boardId);
    } catch (error) {
      console.log(`Failed to delete TaskBoard with Id: ${boardId}: ${error}`);
      throw new Error(`DeleteTaskError: ${error}`);
    }
  };

  updateBoard = (boardId: string, board: ITaskBoard) => {};
  
  getTasks = async (boardId: string): Promise<TaskDto[] | Error> => {
    try {
      const tasks = await this._taskManagementRepository.getAllTasks(boardId);
      return tasks;
    } catch (error) {
      throw new Error("Unable to query the db");
    }
  };

  addTask = async (
    boardId: string,
    task: TaskDto
  ): Promise<mongoose.Types.ObjectId> => {
    try {
      return await this._taskManagementRepository.addTask(boardId, task);
    } catch (error) {
      console.log(`Failed to add task: ${error}`);
      throw new Error(`AddTaskError: ${error}`);
    }
  };

  deleteTask = async (taskId: string) => {
    try {
      return await this._taskManagementRepository.deleteTask(taskId);
    } catch (error) {
      console.log(`Failed to delete task with Id: ${taskId}: ${error}`);
      throw new Error(`DeleteTaskError: ${error}`);
    }
  };

  updateTask = (taskId: string, task: ITask) => {};

  
}
export default TaskManagementService;
