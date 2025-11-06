import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskActuals, updateTaskProgress } from "../controllers/task.controller";

const router = express.Router();

router.route("/").post(createTask).get(getAllTasks);
router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);
router.route("/:id/actuals").patch(updateTaskActuals);
router.route("/:id/progress").put(updateTaskProgress);

export default router;
