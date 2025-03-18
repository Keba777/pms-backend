import { NextFunction, Request, Response } from "express";
import Task from "../models/Task.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new task
// @route   POST /api/v1/tasks
const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating task", 500));
    }
};

// @desc    Get all tasks
// @route   GET /api/v1/tasks
const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await Task.findAll();
        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving tasks", 500));
    }
};

// @desc    Get a task by ID
// @route   GET /api/v1/tasks/:id
const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving task", 500));
    }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        await task.update(req.body);
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating task", 500));
    }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        await task.destroy();
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting task", 500));
    }
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
