import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import initialDBSetup from "./Utilities/initialDBSetup";
import TaskBoardRouter from "./Routers/TaskBoardRouter";

dotenv.config();

const app = express();
app.use(express.json());
const db = process.env.MONGODB_URI || "";
if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const taskRouter = new TaskBoardRouter();
app.use("/taskboard", taskRouter.router);

mongoose
  .connect(db)
  .then(async () => {
    console.log("Initialized connection with DB");
    await initialDBSetup();
  })
  .catch((reason) =>
    console.log(`Unable to connect to the database: ${reason}`)
  );

app.get("/", (req, res) => {
  res.send("Welcome to the Kanban API!");
});

app.listen(5000, () => console.log("Listening on Port: 5000"));
