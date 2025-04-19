import { NextFunction, Request, Response } from "express";
import Role from "../models/Role.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new role
// @route   POST /api/v1/roles
const createRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating role", 500));
    }
};

// @desc    Get all roles
// @route   GET /api/v1/roles
const getAllRoles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving roles", 500));
    }
};

// @desc    Get a role by ID
// @route   GET /api/v1/roles/:id
const getRoleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving role", 500));
    }
};

// @desc    Update a role
// @route   PUT /api/v1/roles/:id
const updateRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        await role.update(req.body);
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating role", 500));
    }
};

// @desc    Delete a role
// @route   DELETE /api/v1/roles/:id
const deleteRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        await role.destroy();
        res.status(200).json({ success: true, message: "Role deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting role", 500));
    }
};

export { createRole, getAllRoles, getRoleById, updateRole, deleteRole };