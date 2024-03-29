import { ITask } from "../Interfaces/ITask";
import { ITaskBoard } from "../Interfaces/ITaskBoard";
import { ITaskManagementRepository } from "../Interfaces/ITaskRepository";
import { TaskBoard } from "../Models/TaskBoard";
import { Subtask, Task } from "../Models/Task";
import { Column } from "../Models/Column";
import { TaskDto } from "../Dtos/TaskDto";
import { SubtaskDto } from "../Dtos/SubtaskDto";
import { ISubtask } from "../Interfaces/ISubtask";
import mongoose from "mongoose";

class TaskManagementRepository implements ITaskManagementRepository {
  constructor() {}

  addBoard = async (
    boardName: string,
    columnNames: string[]
  ): Promise<ITaskBoard> => {
    try {
      const newBoard = await TaskBoard.create({ name: boardName, columns: [] });
      const columnIds = await this.addColumn(newBoard._id, columnNames);
      const board = (await TaskBoard.findByIdAndUpdate(
        newBoard._id,
        { $push: { columns: columnIds } },
        { new: true }
      )) as ITaskBoard;
      if (!board) {
        throw new Error("Invalid Board Id");
      }
      return board;
    } catch (error) {
      throw error;
    }
  };

  addColumn = async (
    boardId: mongoose.Types.ObjectId,
    columnNames: string | string[]
  ): Promise<mongoose.Types.ObjectId[]> => {
    try {
      if (!columnNames) {
        throw new Error("Missing Column Names!");
      }
      const newColumns: mongoose.Types.ObjectId[] = [];
      if (Array.isArray(columnNames)) {
        for (const _name of columnNames) {
          const column = await Column.create({
            name: _name,
            tasks: [],
            taskBoard: boardId,
          });
          newColumns.push(column._id);
        }
        return newColumns.map((column) => column._id);
      } else {
        const newColumn = await Column.create({
          name: columnNames,
          task: [],
          taskBoard: boardId,
        });
        newColumns.push(newColumn._id);
      }
      return newColumns;
    } catch (error) {
      console.error("There was an issue adding the new column");
      throw error;
    }
  };
  deleteBoard = async (boardId: string): Promise<void> => {
    try {
      const boardToDelete = await TaskBoard.findById(boardId);
      if (!boardToDelete) {
        throw new Error(`Unable to locate taskboard with id: ${boardId}`);
      }
      const columns = await Column.find({ taskBoard: boardId });
      const columnIds = columns.map((column) => column._id);

      const tasks = await Task.find({ column: { $in: columnIds } });
      const taskIds = tasks.map((task) => task._id);

      const subtasks = await Subtask.find({ task: { $in: taskIds } });
      const subtaskIds = subtasks.map((subtask) => subtask._id);

      await Subtask.deleteMany({ _id: { $in: subtaskIds } });

      await Task.deleteMany({ _id: { $in: taskIds } });

      await Column.deleteMany({ taskboard: boardId });

      await TaskBoard.findByIdAndDelete(boardId);
    } catch (error) {
      console.error("Error deleting board:", error);
      throw error;
    }
  };

  deleteTask = async (taskId: string): Promise<void> => {
    try {
      const task = await Task.findById(taskId);

      if (!task) {
        throw new Error(`Unable to locate task with id: ${taskId}`);
      }

      await Column.findOneAndUpdate(
        { _id: task.column },
        { $pull: { tasks: task._id } },
        { new: true }
      ).exec();

      await Subtask.deleteMany({ _id: { $in: task.subtasks } });

      await Task.findByIdAndDelete(taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  getAllBoards = (): Promise<ITaskBoard[]> | Error => {
    try {
      return TaskBoard.find();
    } catch (error) {
      console.error("Unable to parse the DB");
      throw error;
    }
  };
  getAllTasks = async (boardId: string): Promise<TaskDto[]> => {
    try {
      const board = await TaskBoard.findOne({ _id: boardId });
      if (!board) return [];

      const columns = await Column.find({ taskBoard: board._id });
      if (!columns) return [];

      const tasks = (await Task.find({
        column: { $in: columns.map((c) => c._id) },
      })) as ITask[];

      const subtasks = (await Subtask.find({
        task: { $in: tasks.map((t) => t._id) },
      })) as ISubtask[];

      interface SubtaskMap {
        [key: string]: SubtaskDto[];
      }
      const subtaskMap: SubtaskMap = subtasks.reduce(
        (acc: SubtaskMap, subtask) => {
          if (!subtask.task) return acc;
          const taskId: string = subtask.task.toString();
          if (!acc[taskId]) {
            acc[taskId] = [];
          }
          acc[taskId].push(
            new SubtaskDto(
              subtask._id.toString(),
              subtask.title,
              subtask.isCompleted,
              taskId
            )
          );

          return acc;
        },
        {}
      );

      const tasksDto = tasks.map((task) => {
        const updatedTask = new TaskDto(
          task.title,
          task.description || "",
          task.column.toString()
        );
        const subtasks = subtaskMap[task._id.toString()];
        updatedTask.id = task._id;
        updatedTask.subtasks = subtasks;
        return updatedTask;
      });

      return tasksDto;
    } catch (error) {
      console.error("Unable to parse the DB");
      throw error;
    }
  };
  getBoard = (boardId: string): Promise<ITaskBoard | null | Error> => {
    try {
      return TaskBoard.findOne({ _id: boardId });
    } catch (error) {
      console.error("Unable to parse the DB");
      throw error;
    }
  };

  addTask = async (boardId: string, task: TaskDto) => {
    try {
      const board = await TaskBoard.findOne({ _id: boardId });
      if (!board) {
        throw new Error("Unable to locate a taskboard with id: " + boardId);
      }

      const column = await Column.findOne({ taskBoard: board._id });
      if (!column) {
        throw new Error("Unable to locate the specifid column ");
      }

      const newTask = await Task.create({
        title: task.title,
        description: task.description,
        status: "Todo",
        subtasks: [],
        column: column._id,
      });

      if (task.subtasks && task.subtasks.length) {
        const subtaskIds = [];
        for (const subtask of task.subtasks) {
          const newSubtask = await Subtask.create({
            title: subtask.title,
            isCompleted: false,
            task: newTask._id,
          });
          subtaskIds.push(newSubtask._id);
        }
        await Task.findByIdAndUpdate(newTask._id, {
          $set: { subtasks: subtaskIds },
        });
      }

      await Column.findByIdAndUpdate(column._id, {
        $push: { tasks: newTask._id },
      });
      newTask.column = column._id;
      return newTask._id;
    } catch (error) {
      console.error(`AddTaskToDBError: ${error}`);
      throw error;
    }
  };
  updateTask = () => {};
  updateBoard = () => {};
}
export default TaskManagementRepository;
