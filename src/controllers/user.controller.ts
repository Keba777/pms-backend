import { NextFunction, Request, Response } from "express";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Get all users
// @route   GET /api/v1/users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.findAll();
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
        const user = await User.findByPk(req.params.id);
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
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        await user.update(req.body);
        res.status(200).json({ success: true, data: user });
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

export { getAllUsers, getUserById, updateUser, deleteUser };
