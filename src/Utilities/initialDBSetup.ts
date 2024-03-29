import mongoose from "mongoose";
import { loadTempData } from "./LoadTempData";
import { TaskBoard } from "../Models/TaskBoard";
import { Subtask, Task } from "../Models/Task";
import { Column } from "../Models/Column";

const initialDBSetup = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("Failed to acquire MONGODB_URI");
  }

  await mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to DB"))
    .catch((reason) =>
      console.error("Failed to connect to the Database: " + reason)
    );

  const data = await loadTempData();

  await TaskBoard.deleteMany({});
  await Column.deleteMany({});
  await Task.deleteMany({});
  await Subtask.deleteMany({});

  try {
    for (const board of data.boards) {
      const newBoard = await TaskBoard.create({ name: board.name });

      if (board.columns && board.columns.length) {
        for (const columnData of board.columns) {
          const newColumn = await Column.create({
            name: columnData.name,
            taskBoard: newBoard._id,
          });

          await TaskBoard.findByIdAndUpdate(newBoard._id, {
            $push: { columns: newColumn._id },
          });

          if (columnData.tasks && columnData.tasks.length) {
            for (const taskData of columnData.tasks) {
              const newTask = await Task.create({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                column: newColumn._id,
              });

              await Column.findByIdAndUpdate(newColumn._id, {
                $push: { tasks: newTask._id },
              });

              if (taskData.subtasks && taskData.subtasks.length) {
                for (const subtaskData of taskData.subtasks) {
                  const newSubtask = await Subtask.create({
                    title: subtaskData.title,
                    isCompleted: subtaskData.isCompleted,
                    task: newTask._id,
                  });
                  await Task.findByIdAndUpdate(newTask._id, {
                    $push: { subtasks: newSubtask._id },
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Unable to complete the operation: " + error);
  }
};

export default initialDBSetup;
