import { Request, Response, NextFunction } from "express";
import Todo from "../models/Todo.model";
import User from "../models/User.model";
import TodoProgress from "../models/TodoProgress.model";
import TodoMember from "../models/TodoMember.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new Todo
// @route   POST /api/v1/todos
export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...todoData } = req.body;

        // Default givenDate to now
        todoData.givenDate = new Date();
        todoData.assignedById = req.user!.id

        const todo = await Todo.create(todoData);

        if (assignedUsers?.length) {
            const users = await User.findAll({ where: { id: assignedUsers } });
            if (users.length !== assignedUsers.length) {
                return next(new ErrorResponse("Some assigned users could not be found", 400));
            }
            await todo.$set("assignedUsers", users);
        }

        const createdTodo = await Todo.findByPk(todo.id, {
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
            ],
        });

        res.status(201).json({ success: true, data: createdTodo });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating todo", 500));
    }
};

// @desc    Get all Todos
// @route   GET /api/v1/todos
export const getAllTodos = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const todos = await Todo.findAll({
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: todos });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving todos", 500));
    }
};

// @desc    Get a single Todo
// @route   GET /api/v1/todos/:id
export const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findByPk(req.params.id, {
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
            ],
        });

        if (!todo) return next(new ErrorResponse("Todo not found", 404));

        res.status(200).json({ success: true, data: todo });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving todo", 500));
    }
};

// @desc    Update a Todo
// @route   PUT /api/v1/todos/:id
export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...todoData } = req.body;
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return next(new ErrorResponse("Todo not found", 404));

        await todo.update(todoData);

        if (Array.isArray(assignedUsers)) {
            const users = await User.findAll({ where: { id: assignedUsers } });
            if (users.length !== assignedUsers.length) {
                return next(new ErrorResponse("Some assigned users could not be found", 400));
            }
            await todo.$set("assignedUsers", users);
        }

        const updatedTodo = await Todo.findByPk(todo.id, {
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
            ],
        });

        res.status(200).json({ success: true, data: updatedTodo });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating todo", 500));
    }
};

// @desc    Delete a Todo
// @route   DELETE /api/v1/todos/:id
export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const todo = await Todo.findByPk(req.params.id);
        if (!todo) return next(new ErrorResponse("Todo not found", 404));

        await todo.destroy();
        res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting todo", 500));
    }
};
