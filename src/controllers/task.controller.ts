import { NextFunction, Request, Response } from "express";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new task
// @route   POST /api/v1/tasks
const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...taskData } = req.body;
        const task = await Task.create(taskData);
        if (assignedUsers?.length) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: assignedUsers,
                },
            });

            if (users.length !== assignedUsers.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }
            await task.$set("assignedUsers", users);
        }
        const createdTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Activity,
                    as: "activities",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });
        res.status(201).json({ success: true, data: createdTask });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating task", 500));
    }
};

// @desc    Get all tasks (with activities and assigned users), sorted by creation date
// @route   GET /api/v1/tasks
const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await Task.findAll({
            include: [
                {
                    model: Activity,
                    as: "activities",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: tasks });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving tasks", 500));
    }
};

// @desc    Get a task by ID (with activities and assigned users)
// @route   GET /api/v1/tasks/:id
const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id, {
            include: [
                {
                    model: Activity,
                    as: "activities",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

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
        const { assignedUsers, ...taskData } = req.body;

        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        await task.update(taskData);

        if (Array.isArray(assignedUsers)) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: assignedUsers,
                },
            });

            if (users.length !== assignedUsers.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }

            await task.$set("assignedUsers", users);
        }

        const updatedTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Activity,
                    as: "activities",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({ success: true, data: updatedTask });
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

// @desc    Update task actuals
// @route   PATCH /api/v1/tasks/:id/actuals
// Expected body: { actuals: { start_date, end_date, progress, status, budget } }
const updateTaskActuals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        const { actuals } = req.body;
        if (!actuals) {
            return next(new ErrorResponse("No actuals data provided", 400));
        }

        // Optional: shallow validation for allowed fields only
        const allowedFields = ["start_date", "end_date", "progress", "status", "budget"];
        const sanitized: any = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(actuals, key)) {
                sanitized[key] = actuals[key];
            }
        }

        // Update task.actuals (replace entire actuals object)
        await task.update({ actuals: sanitized });

        const updatedTask = await Task.findByPk(task.id, {
            include: [
                {
                    model: Activity,
                    as: "activities",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating task actuals", 500));
    }
};

export { createTask, getAllTasks, getTaskById, updateTask, deleteTask, updateTaskActuals };
