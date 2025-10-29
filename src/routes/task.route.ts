import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskActuals } from "../controllers/task.controller";

const router = express.Router();

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);
router.route("/:id/actuals").patch(updateTaskActuals);

export default router;
