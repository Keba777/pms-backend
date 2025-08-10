import { Request, Response, NextFunction } from "express";
import Todo from "../models/Todo.model";
import TodoProgress from "../models/TodoProgress.model";
import cloudinary from "../config/cloudinary";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Add or update progress for a Todo
// @route   POST /api/v1/todos/:todoId/progress
export const addTodoProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { progress, remark } = req.body;
        const { todoId } = req.params;

        const todo = await Todo.findByPk(todoId);
        if (!todo) return next(new ErrorResponse("Todo not found", 404));

        let uploadedFiles: string[] = [];
        if (req.files && Array.isArray(req.files)) {
            const uploadPromises = req.files.map((file: Express.Multer.File) =>
                cloudinary.uploader.upload(file.path, { resource_type: "auto" })
            );
            const results = await Promise.all(uploadPromises);
            uploadedFiles = results.map(r => r.secure_url);
        }

        const progressUpdate = await TodoProgress.create({
            todoId,
            userId: req.user!.id,
            progress,
            remark,
            attachment: uploadedFiles,
        });

        // Update Todo's progress & merge attachments
        const allAttachments = [...(todo.attachment || []), ...uploadedFiles];
        await todo.update({
            progress,
            attachment: allAttachments,
        });

        res.status(201).json({ success: true, data: progressUpdate });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error adding todo progress", 500));
    }
};
