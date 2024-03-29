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
import { IColumn } from "../Interfaces/IColumn";

class TaskManagementRepository implements ITaskManagementRepository {
  constructor() {}

  /**Add a new TaskBoard
   * @param {string}  boardName - The new name for TaskBoard
   * @param {string[]} columnNames - The array of column names to be included
   */
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
  /**
   * Update information for the Provided TaskBoard
   * @param {mongoose.Types.ObjectId} boardId - TaskBoard to be updated
   * @param boardName - New Board name
   * @param columnNames - Update List of column names
   * @returns {Promise<ITaskBoard>}
   */
  updateBoard = async (
    boardId: mongoose.Types.ObjectId,
    boardName: string,
    columnNames: string[]
  ) => {
    try {
      const boardToUpdate = await TaskBoard.findById(boardId);

      if (!boardToUpdate) {
        throw new Error("Unable to locate board with id " + boardId);
      }

      const currentColumns = (await Column.find({
        taskBoard: boardToUpdate._id,
      })) as IColumn[];

      const currentColumnNames: string[] = [];
      const currentColumnIds: mongoose.Types.ObjectId[] = [];

      currentColumns.forEach((column) => {
        currentColumnNames.push(column.name);
        currentColumnIds.push(column._id);
      });

      const columnsToAdd = columnNames.filter(
        (column) => !currentColumnNames.includes(column)
      );

      const updatedColumns = [...currentColumnIds];

      for (const column of columnsToAdd) {
        const newColumn = await this.addColumn(boardToUpdate._id, column);
        updatedColumns.push(...newColumn);
      }

      return (await TaskBoard.findByIdAndUpdate(boardId, {
        name: boardName,
        columns: updatedColumns,
      })) as ITaskBoard;
    } catch (error) {
      console.error("Unable to update the TaskBoard with id " + boardId);
      throw error;
    }
  };
  /**
   * Adds a new Column to a given board
   * @param {mongoose.Types.ObjectId} boardId - The Id for the TaskBoard Model
   * @param {string[]} columnNames - Array of Names for the new column(s)
   * @returns {Promise<mongoose.Types.ObjectId[]>}
   */
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

  /**
   * Deletes the provide column and associated tasks, and subtasks
   * @param columnId
   */
  deleteColumn = async (columnId: mongoose.Types.ObjectId) => {
    try {
      const columnToDelete = await Column.findOne({ _id: columnId });
      if (!columnToDelete) {
        throw new Error(`Unable to locate a column with id: ${columnId}`);
      }
      const tasksToDelete = await Task.find({ columnId: columnId }).select(
        "_id"
      );
      for (const task of tasksToDelete) {
        await Subtask.deleteMany({ task: task._id });
        await Task.findByIdAndDelete({ _id: task._id });
      }
      await Column.findByIdAndDelete({ _id: columnId });
    } catch (error) {
      console.error("Unable to delete Column with id " + columnId);
      throw error;
    }
  };
  /**
   * Updates information for the provided Column
   * @param columnId
   * @param {IColumn} columnDto
   */
  updateColumn = async (columnId: mongoose.Types.ObjectId, column: IColumn) => {
    try {
      const columnToUpdate = await Column.findByIdAndUpdate(
        columnId,
        {
          name: column.name,
          tasks: column.tasks,
          taskBoard: column.taskBoard,
        },
        { new: true }
      );
      if (!columnToUpdate) {
        throw new Error("Unable to locate Column with id: " + columnId);
      }
      return columnToUpdate._id;
    } catch (error) {
      console.error("Unable to Update Column with id " + columnId);
      throw error;
    }
  };
  /**
   * Deletes the provided board and associated Columns, Tasks, and Subtasks
   * @param boardId - Board to be deleted
   */
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

  /**
   * Deleted the provided task and associated subtasks
   * @param taskId
   */
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

  /**
   * Retrieves all available TaskBoards
   * @returns {Promise<ITaskBoard[]>}
   */
  getAllBoards = (): Promise<ITaskBoard[]> | Error => {
    try {
      return TaskBoard.find();
    } catch (error) {
      console.error("Unable to parse the DB");
      throw error;
    }
  };

  /**
   * Retrieves all Tasks for a given TaskBoard
   * @param boardId - Board to be queried against
   * @returns {Promise<TaskDto[]>}
   */
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

  /**
   * Retrieve a TaskBoard by its Id
   * @param boardId - Board to be queried
   * @returns {Promise<ITaskBoard | null | Error>}
   */
  getBoard = (boardId: string): Promise<ITaskBoard | null | Error> => {
    try {
      return TaskBoard.findOne({ _id: boardId });
    } catch (error) {
      console.error("Unable to parse the DB");
      throw error;
    }
  };

  /**
   * Add a new Task
   * @param boardId - Board to be queried
   * @param task - The new Task to be added
   * @returns {Promise<mongoose.Types.ObjectId>}
   */
  addTask = async (
    boardId: string,
    task: TaskDto
  ): Promise<mongoose.Types.ObjectId> => {
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

  /**
   *Update the given task based on the provided TaskDto
   * @param {string} taskId - The Task to be updated
   * @param {TaskDto} updatedTask - The xpected Task
   * @returns {TaskDto}
   */
  updateTask = async (taskId: string, updatedTask: TaskDto) => {
    try {
      const taskToUpdate = await Task.findById(taskId);

      if (!taskToUpdate) {
        throw new Error(`Unable to locate task with id: ${taskId}`);
      }

      const currentSubtasks = taskToUpdate.subtasks.map(
        (subtask) => subtask._id
      );
      const newSubtasks = updatedTask.subtasks.filter(
        (subtask) =>
          !currentSubtasks.includes(new mongoose.Types.ObjectId(subtask.id))
      );

      const subtasksToAdd: mongoose.Types.ObjectId[] = [];

      for (const subtask of newSubtasks) {
        const newSubtask = await this.addSubtask(taskToUpdate._id, subtask);
        subtasksToAdd.push(newSubtask._id);
      }

      await Task.findByIdAndUpdate(taskId, {
        name: updatedTask.title,
        description: updatedTask.description,
        status: updatedTask.status,
        column: updatedTask.column,
        subtasks: [...currentSubtasks, ...subtasksToAdd],
      });
    } catch (error) {
      console.error("Failed to update the provided Task");
      throw error;
    }
  };

  /**
   * Creates a new subtask
   * @param taskId - Parent Task Id
   * @param updatedSubtask - Information to be included in the subtask
   * @returns {mongoose.Types.ObjectId}
   */
  addSubtask = async (
    taskId: mongoose.Types.ObjectId,
    updatedSubtask: SubtaskDto
  ) => {
    try {
      const newSubtask = await Subtask.create({
        title: updatedSubtask.title,
        isCompleted: updatedSubtask.isCompleted,
        task: taskId,
      });
      await Task.findByIdAndUpdate(taskId, {
        $push: { subtasks: newSubtask._id },
      });
      return newSubtask._id;
    } catch (error) {
      console.error("Failed to add the subtask");
      throw error;
    }
  };

  /**
   * Removes the provide subtask from the Database
   * @param subtaskId - Subtask to be deleted
   */
  deleteSubtask = async (subtaskId: mongoose.Types.ObjectId) => {
    try {
      const subtaskToDelete = await Subtask.findOne({ _id: subtaskId });
      if (!subtaskToDelete) {
        throw new Error(`Unable to locate Subtask with id: ${subtaskId}`);
      }

      await Task.findByIdAndUpdate(subtaskToDelete.task, {
        $pull: { subtasks: subtaskToDelete._id },
      });

      await Subtask.findByIdAndDelete(subtaskToDelete._id);
    } catch (error) {
      console.error("Unable to Delete the subtask");
      throw error;
    }
  };

  /**
   * Updates the provide subtask information
   * @param subtaskId - Subtask to be updated
   * @param subtask - Subtask Information to be proved
   * @returns
   */
  updateSubtask = async (
    subtaskId: mongoose.Types.ObjectId,
    subtask: SubtaskDto
  ) => {
    try {
      const newSubtask = await Subtask.findByIdAndUpdate(
        subtaskId,
        {
          title: subtask.title,
          isCompleted: subtask.isCompleted,
          task: subtask.task,
        },
        { new: true }
      );
      if (!newSubtask) {
        throw new Error("Unable to locate subtask with id " + subtaskId);
      }
      return newSubtask._id;
    } catch (error) {
      console.error("Unable to Update the subtask");
      throw error;
    }
  };
}
export default TaskManagementRepository;
