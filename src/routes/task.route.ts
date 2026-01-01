import express from "express";
import { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskActuals, updateTaskProgress } from "../controllers/task.controller";
import { uploadFiles } from "../middlewares/multer";

const router = express.Router();

router.route("/").post(uploadFiles.array("attachments"), createTask).get(getAllTasks);
router.route("/:id").get(getTaskById).put(uploadFiles.array("attachments"), updateTask).delete(deleteTask);
router.route("/:id/actuals").patch(updateTaskActuals);
router.route("/:id/progress").put(updateTaskProgress);

export default router;
