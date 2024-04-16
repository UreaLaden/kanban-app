import mongoose from "mongoose";
import { TaskDto } from "../Dtos/TaskDto";
import { ITask } from "../Interfaces/ITask";
import { ITaskBoard } from "../Interfaces/ITaskBoard";
import { ITaskManagementService } from "../Interfaces/ITaskManagementService";
import { ITaskManagementRepository } from "../Interfaces/ITaskRepository";
import TaskManagementRepository from "../Repositories/TaskRepository";
import TaskboardDto from "../Dtos/TaskboardDto";
import { SubtaskDto } from "../Dtos/SubtaskDto";

class TaskManagementService implements ITaskManagementService {
  private _taskManagementRepository: ITaskManagementRepository;

  constructor() {
    this._taskManagementRepository = new TaskManagementRepository();
  }
  getBoard = async (boardId: string): Promise<TaskboardDto | null | Error> => {
    try {
      const board = await this._taskManagementRepository.getBoard(boardId);
      return board;
    } catch (error) {
      throw new Error("Unable to query the DB");
    }
  };

  getBoards = async (): Promise<TaskboardDto[]> => {
    try {
      const boards =
        (await this._taskManagementRepository.getAllBoards()) as ITaskBoard[];
      if (!boards) {
        return [];
      }
      const boardDtos: TaskboardDto[] = [];

      for (const board of boards) {
        const columns = await this._taskManagementRepository.getAllColumns(
          board._id.toString()
        );
        const updatedBoard = new TaskboardDto(board.name, columns);
        updatedBoard.id = board._id;
        boardDtos.push(updatedBoard);
      }

      return boardDtos;
    } catch (error) {
      throw new Error("Unable to query the db");
    }
  };

  addBoard = async (
    boardName: string,
    columnNames: string[]
  ): Promise<TaskboardDto> => {
    try {
      const newBoard: ITaskBoard =
        await this._taskManagementRepository.addBoard(boardName, columnNames);

      const columns = await this._taskManagementRepository.getAllColumns(
        newBoard.id
      );
      console.log(columns);
      const boardDto = new TaskboardDto(boardName, columns);
      boardDto.id = newBoard._id;
      return boardDto;
    } catch (error) {
      console.error("Internal Server Error");
      throw error;
    }
  };

  deleteBoard = async (boardId: string) => {
    try {
      return await this._taskManagementRepository.deleteBoard(boardId);
    } catch (error) {
      console.log(`Failed to delete TaskBoard with Id: ${boardId}: ${error}`);
      throw new Error(`DeleteTaskError: ${error}`);
    }
  };

  updateBoard = async (
    boardId: string,
    boardName: string,
    columnNames: string[]
  ) => {
    try {
      const dbBoardId = new mongoose.Types.ObjectId(boardId);
      const updatedBoard = await this._taskManagementRepository.updateBoard(
        dbBoardId,
        boardName,
        columnNames
      );
      return updatedBoard;
    } catch (error) {
      console.log("UpdateTaskBoardError: " + error);
      throw error;
    }
  };

  getTasks = async (boardId: string): Promise<TaskDto[] | Error> => {
    try {
      const tasks = await this._taskManagementRepository.getAllTasks(boardId);
      return tasks;
    } catch (error) {
      throw new Error("Unable to query the db");
    }
  };

  getTaskById = async (taskId: string): Promise<TaskDto> => {
    try {
      const task = await this._taskManagementRepository.getTask(taskId);
      if (!task) {
        throw new Error("Unable to locate Task with Id: " + taskId);
      }
      const subtasks = await this._taskManagementRepository.getAllSubtasks(
        task
      );
      if (!subtasks) {
        throw new Error("Unable to find any subtasks for the provided task");
      }
      const taskDto = new TaskDto(
        task.title,
        task.description ?? "",
        task.column.toString(),
        subtasks
      );
      taskDto.id = task._id;
      return taskDto;
    } catch (error) {
      console.error("RetrieveTaskError " + error);
      throw error;
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

  updateTask = async (taskId: string, task: TaskDto) => {
    try {
      const dbTask = await this._taskManagementRepository.getTask(taskId);
      if (!dbTask) {
        throw new Error("Unable to locate task with Id: " + taskId);
      }
      const providedSubtaskIds = task.subtasks.map((subtask) => subtask.id);
      const subtasks: SubtaskDto[] = [];
      for (const subtaskId of providedSubtaskIds) {
        const subtask = new mongoose.Types.ObjectId(subtaskId);
        const dbSubtask = await this._taskManagementRepository.getSubtask(
          subtask
        );
        if (!dbSubtask) {
          throw new Error("Unable to locate subtask with Id: " + subtask);
        }
        const newSubtaskDto: SubtaskDto = new SubtaskDto(
          dbSubtask._id.toString(),
          dbSubtask.title,
          dbSubtask.isCompleted,
          dbTask._id
        );
        subtasks.push(newSubtaskDto);
      }

      const newTaskDto = new TaskDto(
        task.title,
        task.description ?? "",
        task.column,
        subtasks
      );
      await this._taskManagementRepository.updateTask(dbTask._id, newTaskDto);
    } catch (error) {
      console.log("UpdateTaskBoardError: " + error);
      throw error;
    }
  };
}
export default TaskManagementService;
