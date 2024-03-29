import { ITaskManagementService } from "../Interfaces/ITaskManagementService";
import { Router } from "express";
import TaskManagementService from "../Services/TaskManagementService";
import cors from "cors";
import { ITaskManagementController } from "../Interfaces/ITaskManagementController";
import TaskManagementController from "../Controllers/TaskManagementController";

class TaskBoardRouter {
  private _taskManagementController: ITaskManagementController;
  private _router: Router;
  constructor() {
    this._router = Router();
    this._router.use(cors({ origin: "*" }));
    this._taskManagementController = new TaskManagementController();
    this.initializeRoutes();
  }

  public get router(): Router {
    return this._router;
  }

  initializeRoutes = () => {
    //Get All TaskBoards
    this._router.get("/", async (req, res) => {
      this._taskManagementController.getTaskBoards(req, res);
    });

    // Add a new Task Board
    this._router.post("/", async (req,res) => {
      this._taskManagementController.getTaskBoard(req,res);
    })

    //Get Board By Id
    this._router.get("/:boardId", async (req, res) => {
      this._taskManagementController.getTaskBoard(req, res);
    });

    // Delete a Task Board
    this._router.delete("/board/:boardId", async (req,res) => {
      this._taskManagementController.deleteTaskBoard(req,res);
    })

    //Get All Tasks By Board Id
    this._router.get("/:boardId/tasks", async (req, res) => {
      this._taskManagementController.getTasks(req, res);
    });

    //Add Task
    this._router.post("/:boardId/tasks", async (req, res) => {
      this._taskManagementController.addTask(req, res);
    });

    this._router.delete("/task/:taskId", async (req,res) => {
      this._taskManagementController.deleteTask(req,res);
    })

    
  };
}

export default TaskBoardRouter;
