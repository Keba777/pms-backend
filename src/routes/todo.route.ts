import express from "express";
import {
    createTodo,
    getAllTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
} from "../controllers/todo.controller";
import { addTodoProgress, } from "../controllers/todoProgress.controller";
import { uploadFiles } from "../middlewares/multer";

const router = express.Router();

router
    .route("/")
    .post(uploadFiles.array("attachments"), createTodo)
    .get(getAllTodos);

router
    .route("/:id")
    .get(getTodoById)
    .put(uploadFiles.array("attachments"), updateTodo)
    .delete(deleteTodo);

router
    .route("/:todoId/progress")
    .post(uploadFiles.array("attachments"), addTodoProgress)

export default router;
