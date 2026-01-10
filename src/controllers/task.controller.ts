import { NextFunction, Response } from "express";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { ReqWithUser } from "../types/req-with-user";
import notificationService from "../services/notificationService";

// @desc    Create a new task
// @route   POST /api/v1/tasks
const createTask = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...taskData } = req.body;

        // Handle file uploads
        const files = (req.files as Express.Multer.File[]) || [];
        const attachmentUrls: string[] = [];

        for (const file of files) {
            // file.path is now absolute from multer config
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "task_attachments",
                resource_type: "auto",
            });
            fs.unlinkSync(file.path);
            attachmentUrls.push(result.secure_url);
        }

        const taskPayload = {
            ...taskData,
            attachments: attachmentUrls,
            orgId: req.user?.orgId
        };

        const task = await Task.create(taskPayload);
        // Normalize assignedUsers to array if it is a single value (FormData quirk)
        if (assignedUsers && !Array.isArray(assignedUsers)) {
            // @ts-ignore
            req.body.assignedUsers = [assignedUsers];
        }
        const userIds = Array.isArray(assignedUsers)
            ? assignedUsers
            : assignedUsers ? [assignedUsers] : [];

        if (userIds.length > 0) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: userIds,
                },
            });

            if (users.length !== userIds.length) {
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

        // Send notifications to assigned users
        if (userIds.length > 0 && createdTask) {
            const assignedBy = req.user?.first_name + ' ' + req.user?.last_name || 'Someone';
            for (const userId of userIds) {
                notificationService.notifyTaskAssigned(
                    userId,
                    createdTask.id,
                    createdTask.task_name || 'Untitled Task',
                    assignedBy
                ).catch(err => console.error('Notification error:', err));
            }
        }

        res.status(201).json({ success: true, data: createdTask });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating task", 500));
    }
};

// @desc    Get all tasks (with activities and assigned users), sorted by creation date
// @route   GET /api/v1/tasks
const getAllTasks = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const where: any = {};

        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = user?.orgId;
        }

        const tasks = await Task.findAll({
            where,
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
const getTaskById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
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

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && task.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to access this task", 403));
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving task", 500));
    }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
const updateTask = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, existingAttachments, ...taskData } = req.body;

        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && task.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this task", 403));
        }

        // Handle file uploads (new files)
        const files = (req.files as Express.Multer.File[]) || [];
        const newAttachmentUrls: string[] = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "task_attachments",
                resource_type: "auto",
            });
            fs.unlinkSync(file.path);
            newAttachmentUrls.push(result.secure_url);
        }

        // Handle existing attachments
        let keptAttachments: string[] = [];
        if (existingAttachments) {
            // If coming from FormData, it might be a single string or an array of strings
            keptAttachments = Array.isArray(existingAttachments)
                ? existingAttachments
                : [existingAttachments];
        }

        const updatedAttachments = [...keptAttachments, ...newAttachmentUrls];

        await task.update({
            ...taskData,
            attachments: updatedAttachments
        });

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

        // Send notifications to assigned users if task was updated
        if (updatedTask && Array.isArray(assignedUsers) && assignedUsers.length > 0) {
            const updatedBy = req.user?.first_name + ' ' + req.user?.last_name || 'Someone';
            for (const userId of assignedUsers) {
                notificationService.notifyTaskUpdated(
                    userId,
                    updatedTask.id,
                    updatedTask.task_name || 'Untitled Task',
                    updatedBy
                ).catch(err => console.error('Notification error:', err));
            }
        }

        // Check if task was completed and notify creator (if we had created_by field)
        // For now, we'll skip this notification or you can add the field later

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating task", 500));
    }
};


// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
const deleteTask = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && task.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to delete this task", 403));
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
const updateTaskActuals = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) {
            return next(new ErrorResponse("Task not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && task.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this task", 403));
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


/**
 * @desc    Update task progress
 * @route   PUT /api/v1/tasks/:id/progress
 * @body    { progress: number, remark?, status?, checkedBy?, approvedBy?, action?, summaryReport?, comment?, approvedDate?, dateTime? }
 */
const updateTaskProgress = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const t = await Task.sequelize?.transaction();
    try {
        const task = await Task.findByPk(req.params.id, { transaction: t });
        if (!task) {
            if (t) await t.rollback();
            return next(new ErrorResponse("Task not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && task.orgId !== user?.orgId) {
            if (t) await t.rollback();
            return next(new ErrorResponse("Not authorized to update this task", 403));
        }

        const {
            progress,
            remark,
            status,
            checkedBy,
            approvedBy,
            action,
            summaryReport,
            comment,
            approvedDate,
            dateTime,
        } = req.body;

        if (typeof progress !== "number") {
            if (t) await t.rollback();
            return next(new ErrorResponse("progress (number) is required", 400));
        }

        const progressUpdate: any = {
            id: undefined,
            dateTime: dateTime || new Date().toISOString(),
            fromProgress: task.getDataValue("progress"),
            progress,
            remark,
            status,
            checkedBy,
            approvedBy,
            action,
            summaryReport,
            comment,
            approvedDate: approvedDate ?? null,
            userId: (req as any).user?.id || req.body.userId,
        };

        const updatePayload: any = { progress };
        if (checkedBy) updatePayload.checked_by_name = checkedBy;

        await task.update(updatePayload, {
            transaction: t,
            userId: (req as any).user?.id || req.body.userId,
            progressUpdate,
        });

        if (t) await t.commit();

        const updatedTask = await Task.findByPk(task.id, {
            include: [
                { model: Activity, as: "activities" },
                { model: User, as: "assignedUsers", through: { attributes: [] }, attributes: { exclude: ["password"] } },
            ],
        });

        res.status(200).json({ success: true, data: updatedTask });
    } catch (error) {
        console.error(error);
        if (t) await t.rollback();
        next(new ErrorResponse("Error updating task progress", 500));
    }
};

export {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask,
    updateTaskActuals,
    updateTaskProgress,
};

