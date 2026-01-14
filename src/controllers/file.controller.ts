import { Request, Response, NextFunction } from "express";
import { ReqWithUser } from "../types/req-with-user";
import File from "../models/File.model";
import cloudinary from "../config/cloudinary";
import ErrorResponse from "../utils/error-response.utils";
import User from "../models/User.model";
import fs from "fs";

// @desc    Upload a new file
// @route   POST /api/v1/files
export const uploadFile = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return next(new ErrorResponse("No files uploaded", 400));
        }

        const { title, sendTo, type, referenceId } = req.body;

        if (!title || !sendTo || !type || !referenceId) {
            return next(
                new ErrorResponse("Title, sendTo, type, and referenceId are required", 400)
            );
        }

        if (!["project", "task", "activity", "todo"].includes(type)) {
            return next(new ErrorResponse("Invalid type", 400));
        }

        const files = await Promise.all(
            (req.files as Express.Multer.File[]).map(async (file) => {
                const result = await cloudinary.uploader.upload(file.path, {
                    folder: "uploads",
                });
                // Remove local file after upload
                fs.unlinkSync(file.path);

                return File.create({
                    title,
                    date: new Date(),
                    uploadedBy: req.user!.id,
                    sendTo,
                    fileName: file.originalname,
                    fileUrl: result.secure_url,
                    type,
                    referenceId,
                });
            })
        );

        const populatedFiles = await Promise.all(
            files.map((f) =>
                File.findByPk(f.id, {
                    include: [
                        { model: User, as: "uploadedByUser", attributes: { exclude: ["password"] } },
                        { model: User, as: "sendToUser", attributes: { exclude: ["password"] } },
                    ],
                })
            )
        );

        res.status(201).json({ success: true, data: populatedFiles });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error uploading files", 500));
    }
};

// @desc    Get all files
// @route   GET /api/v1/files
export const getAllFiles = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const files = await File.findAll({
            include: [
                { model: User, as: "uploadedByUser", attributes: { exclude: ["password"] } },
                { model: User, as: "sendToUser", attributes: { exclude: ["password"] } },
            ],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ success: true, data: files });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching files", 500));
    }
};

// @desc    Get single file by ID
// @route   GET /api/v1/files/:id
export const getFileById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await File.findByPk(req.params.id as string, {
            include: [
                { model: User, as: "uploadedByUser", attributes: { exclude: ["password"] } },
                { model: User, as: "sendToUser", attributes: { exclude: ["password"] } },
            ],
        });

        if (!file) return next(new ErrorResponse("File not found", 404));

        res.status(200).json({ success: true, data: file });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching file", 500));
    }
};

// @desc    Update a file's title or sendTo
// @route   PUT /api/v1/files/:id
export const updateFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await File.findByPk(req.params.id as string);
        if (!file) return next(new ErrorResponse("File not found", 404));

        const { title, sendTo } = req.body;

        await file.update({ title: title ?? file.title, sendTo: sendTo ?? file.sendTo });

        const updatedFile = await File.findByPk(file.id, {
            include: [
                { model: User, as: "uploadedByUser", attributes: { exclude: ["password"] } },
                { model: User, as: "sendToUser", attributes: { exclude: ["password"] } },
            ],
        });

        res.status(200).json({ success: true, data: updatedFile });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating file", 500));
    }
};

// @desc    Delete a file
// @route   DELETE /api/v1/files/:id
export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = await File.findByPk(req.params.id as string);
        if (!file) return next(new ErrorResponse("File not found", 404));

        // Delete from Cloudinary using public_id extracted from fileUrl
        const publicId = file.fileUrl.split("/").pop()?.split(".")[0];
        if (publicId) {
            await cloudinary.uploader.destroy(`uploads/${publicId}`);
        }

        await file.destroy();
        res.status(200).json({ success: true, message: "File deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting file", 500));
    }
};
