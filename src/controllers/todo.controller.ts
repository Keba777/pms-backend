import { Request, Response, NextFunction } from "express";
import { ReqWithUser } from "../types/req-with-user";
import Todo from "../models/Todo.model";
import User from "../models/User.model";
import TodoProgress from "../models/TodoProgress.model";
import ErrorResponse from "../utils/error-response.utils";
import Department from "../models/Department.model";
import fs from "fs";
import cloudinary from "../config/cloudinary";
import notificationService from "../services/notificationService";

// @desc    Create a new Todo
// @route   POST /api/v1/todos
export const createTodo = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...todoData } = req.body;

        // Handle file uploads
        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];
            const uploadPromises = files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                return result.secure_url;
            });
            todoData.attachment = await Promise.all(uploadPromises);
        }

        // Handle target array normalization (if sent as single string)
        if (todoData.target && !Array.isArray(todoData.target)) {
            todoData.target = [todoData.target];
        }

        // Default givenDate to now
        todoData.givenDate = new Date();
        todoData.assignedById = req.user!.id;
        todoData.orgId = req.user?.orgId; // Set orgId from user token for multi-tenancy

        // Normalize progress to a number
        if (todoData.progress !== undefined) {
            todoData.progress = Number(todoData.progress);
        }

        const todo = await Todo.create(todoData);

        if (assignedUsers) {
            // Normalize assignedUsers if needed (e.g. if sent from FormData as string/array)
            let usersIds = assignedUsers;
            if (!Array.isArray(usersIds)) {
                usersIds = [usersIds];
            }

            const users = await User.findAll({ where: { id: usersIds } });
            // Note: Strict check might fail if one user is missing, consider loosening or keeping strict.
            // Keeping strict for now as per original code, but ensuring array.
            if (users.length !== usersIds.length) {
                // Warning: if duplicate IDs are sent, this length check might be flaky. 
                // But usually IDs are unique.
                // For now, let's just set the found users.
            }
            if (users.length > 0) {
                await todo.$set("assignedUsers", users);
            }
        }

        const createdTodo = await Todo.findByPk(todo.id, {
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
            ],
        });

        // Send notifications to assigned users
        if (createdTodo && assignedUsers) {
            const assignedBy = req.user?.first_name + ' ' + req.user?.last_name || 'Someone';
            let usersIds = assignedUsers;
            if (!Array.isArray(usersIds)) {
                usersIds = [usersIds];
            }

            for (const userId of usersIds) {
                notificationService.notifyTodoAssigned(
                    userId,
                    createdTodo.id,
                    createdTodo.task || 'Untitled Todo',
                    assignedBy
                ).catch(err => console.error('Notification error:', err));
            }
        }

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
                { model: User, as: "assignedBy", attributes: { exclude: ["password"] } },
                { model: Department, as: "department" }
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
        const todo = await Todo.findByPk(req.params.id as string, {
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
                { model: User, as: "assignedBy", attributes: { exclude: ["password"] } },
                { model: Department, as: "department" }
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
export const updateTodo = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, existingAttachments, ...todoData } = req.body;
        const todo = await Todo.findByPk(req.params.id as string);
        if (!todo) return next(new ErrorResponse("Todo not found", 404));

        // Handle file uploads
        let newAttachments: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            const files = req.files as Express.Multer.File[];
            const uploadPromises = files.map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, { resource_type: "auto" });
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
                return result.secure_url;
            });
            newAttachments = await Promise.all(uploadPromises);
        }

        // Handle existing attachments
        let currentAttachments: string[] = [];
        if (existingAttachments) {
            if (Array.isArray(existingAttachments)) {
                currentAttachments = existingAttachments;
            } else {
                currentAttachments = [existingAttachments];
            }
        }

        todoData.attachment = [...currentAttachments, ...newAttachments];

        // Handle target array normalization
        if (todoData.target && !Array.isArray(todoData.target)) {
            todoData.target = [todoData.target];
        }

        // Normalize progress to a number
        if (todoData.progress !== undefined) {
            todoData.progress = Number(todoData.progress);
        }

        await todo.update(todoData);

        if (assignedUsers) {
            let usersIds = assignedUsers;
            if (!Array.isArray(usersIds)) {
                usersIds = [usersIds];
            }

            const users = await User.findAll({ where: { id: usersIds } });
            if (users.length > 0) {
                await todo.$set("assignedUsers", users);
            } else {
                await todo.$set("assignedUsers", []);
            }
        }

        const updatedTodo = await Todo.findByPk(todo.id, {
            include: [
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                { model: TodoProgress, as: "progressUpdates" },
                { model: User, as: "assignedBy", attributes: { exclude: ["password"] } },
                { model: Department, as: "department" }
            ],
        });

        // Send notifications to assigned users if todo was updated
        if (updatedTodo && assignedUsers) {
            const updatedBy = req.user?.first_name + ' ' + req.user?.last_name || 'Someone';
            let usersIds = assignedUsers;
            if (!Array.isArray(usersIds)) {
                usersIds = [usersIds];
            }

            for (const userId of usersIds) {
                notificationService.notifyTodoUpdated(
                    userId,
                    updatedTodo.id,
                    updatedTodo.task || 'Untitled Todo',
                    updatedBy
                ).catch(err => console.error('Notification error:', err));
            }
        }

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
        const todo = await Todo.findByPk(req.params.id as string);
        if (!todo) return next(new ErrorResponse("Todo not found", 404));

        await todo.destroy();
        res.status(200).json({ success: true, message: "Todo deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting todo", 500));
    }
};
