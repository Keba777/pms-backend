import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import ErrorResponse from "../utils/error-response.utils";
import RequestModel from "../models/Request.model";
import Role from "../models/Role.model";
import Department from "../models/Department.model";
import Site from "../models/Site.model";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { Op } from 'sequelize';

// @desc    Get all users
// @route   GET /api/v1/users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    attributes: ["id", "name", "permissions"],
                },
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
                {
                    model: Site,
                    as: "site",
                    attributes: ["id", "name"],
                },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving users", 500));
    }
};

// @desc    Get a user by ID
// @route   GET /api/v1/users/:id
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: Role,
                    attributes: ["id", "name", "permissions"],
                },
                {
                    model: Department,
                    as: "department",
                    attributes: ["id", "name"],
                },
                {
                    model: Site,
                    as: "site",
                    attributes: ["id", "name"],
                },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
        });

        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving user", 500));
    }
};

// @desc    Update a user
// @route   PUT /api/v1/users/:id
declare module "express-serve-static-core" {
    interface Request {
        file?: Express.Multer.File;
    }
}

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        const updates: Record<string, any> = { ...req.body };
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "/pms/images",
                use_filename: true,
            });

            fs.unlink(req.file.path, (err: any) => {
                if (err) console.warn("Failed to delete temp file:", err);
            });

            updates.profile_picture = result.secure_url;
        }

        await user.update(updates);
        const updatedUser = await User.findByPk(req.params.id, {
            attributes: { exclude: ["password"] },
            include: [
                { model: Role, attributes: ["id", "name", "permissions"] },
                { model: Department, as: "department", attributes: ["id", "name"] },
                { model: Site, as: "site", attributes: ["id", "name"] },
                { model: Project, through: { attributes: [] } },
                { model: Task, through: { attributes: [] } },
                { model: Activity, through: { attributes: [] } },
                { model: RequestModel },
            ],
        });

        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating user", 500));
    }
};

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        await user.destroy();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting user", 500));
    }
};

const fetchUsersExcluding = async (excludeId: string) => {
    return User.findAll({
        where: {
            id: { [Op.ne]: excludeId }
        },
        attributes: ['id', 'name', 'email']
    });
};

export { getAllUsers, getUserById, updateUser, deleteUser, fetchUsersExcluding };
