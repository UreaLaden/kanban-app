import { Request, Response } from "express";
import { ITaskManagementController } from "../Interfaces/ITaskManagementController";
import { ITaskManagementService } from "../Interfaces/ITaskManagementService";
import TaskManagementService from "../Services/TaskManagementService";
import { TaskDto } from "../Dtos/TaskDto";

class TaskManagementController implements ITaskManagementController {
  private _taskManagementService: ITaskManagementService;
  constructor() {
    this._taskManagementService = new TaskManagementService();
  }
  updateTaskBoard = async (request: Request, response: Response) => {
    const { boardId } = request.params;
    if (!boardId) {
      response.status(400).send("Invalid Request. Missing TaskBoardId.");
    }
    try {
    } catch (error) {
      console.error("UpdateTaskError: " + error);
      throw error;
    }
  };

  deleteTaskBoard = async (request: Request, response: Response) => {
    const { boardId } = request.params;
    if (!boardId) {
      response.status(400).send("Invalid Request. Missing TaskBoardId.");
    }
    try {
      await this._taskManagementService.deleteBoard(boardId);
      response
        .status(201)
        .send("TaskBoard and related objects deleted successfully");
    } catch (error) {
      console.error(`Unable to delete the Board: ${error}`);
      response.status(500).send(`Unable to delete the Board: ${error}`);
    }
  };

  deleteTask = async (request: Request, response: Response) => {
    const { taskId } = request.params;
    if (!taskId) {
      response.status(400).send("Invalid Request. Missing TaskId.");
    }
    try {
      await this._taskManagementService.deleteTask(taskId);
      response
        .status(201)
        .send("Task and related objects deleted successfully");
    } catch (error) {
      console.error(`Unable to delete the task: ${error}`);
      response.status(500).send(`Unable to delete the task: ${error}`);
    }
  };

  getTaskBoards = async (request: Request, response: Response) => {
    try {
      const boards = await this._taskManagementService.getBoards();
      response.status(200).send(boards);
    } catch (error) {
      response.status(500).json({
        message: "Unable to obtain the task boards",
        error: JSON.stringify(error),
      });
    }
  };

  getTaskBoard = async (request: Request, response: Response) => {
    const { boardId } = request.params;
    try {
      if (!boardId) {
        response.status(400).send("Invalid Request. Missing 'boardId'");
      }

      const board = await this._taskManagementService.getBoard(boardId);
      if (!board) {
        response
          .sendStatus(404)
          .send(`Unable to locate TaskBoard with id: [${boardId}]`);
      }

      response.status(200).send(board);
    } catch (error) {
      response.status(500).send("Unable to obtain the task boards");
    }
  };

  addTaskBoard = async (request: Request, response: Response) => {
    try {
      if (!request.body) {
        response.status(400).send({
          message: "Missing required Board name or list of Column Names",
        });
        return;
      }
      const { name, columns } = request.body;
      const newBoard = await this._taskManagementService.addBoard(
        name,
        columns
      );
      response.status(201).send(newBoard);
    } catch (error) {
      console.error("There was an issue creating the board");
      throw error;
    }
  };

  getTasks = async (request: Request, response: Response) => {
    try {
      const { boardId } = request.params;
      const tasks = await this._taskManagementService.getTasks(
        boardId as string
      );
      response.status(200).send(tasks);
    } catch (error) {
      response.status(500).send("Unable to obtain those tasks");
    }
  };

  getTaskById = async (request: Request, response: Response) => {
    const { taskId } = request.params;
    if (!request.params || !taskId) {
      response.status(400).send({ message: "Invalid Request: Missing taskId" });
      return;
    }
    try {
      const task = await this._taskManagementService.getTaskById(taskId);
      response.status(200).send(task);
    } catch (error) {
      response
        .status(500)
        .send({ message: "Internal Server Error", error: error });
    }
  };

  addTask = async (request: Request, response: Response) => {
    const { boardId } = request.params;
    if (!request.body || !request.body.task) {
      response
        .status(400)
        .send({ message: "Missing required task request information" });
      return;
    }
    const { task } = request.body;
    try {
      const taskToAdd = new TaskDto(
        task.title,
        task.description,
        task.column,
        task.subtasks
      );
      const updatedTask = await this._taskManagementService.addTask(
        boardId,
        taskToAdd
      );
      taskToAdd.id = updatedTask.toString();

      response.status(201).send(taskToAdd);
    } catch (error) {
      console.error(error);
      response.status(500).send({
        message: "Failed to create the Task",
        error: JSON.stringify(error),
      });
    }
  };
  updateTask = async (request: Request, response: Response) => {
    const { taskId } = request.params;
    if (!request.params || !request.params.taskId) {
      response.status(400).send("Invalid Request. Missing taskId");
      return;
    }

    if (!request.body) {
      response
        .status(400)
        .send(
          "Invalid Request. Missing required [title,description,subtasks,column]"
        );
      return;
    }

    const { title, description, subtasks, column } = request.body;
    try {
      const taskToUpdate = new TaskDto(title, description, column, subtasks);
      await this._taskManagementService.updateTask(taskId, taskToUpdate);
      response.status(200).send("Updated Successfully");
    } catch (error) {
      console.error("UpdateTaskError: " + error);
      response.status(500).send({ message: "UpdateTaskError", error: error });
    }
  };
}

export default TaskManagementController;
