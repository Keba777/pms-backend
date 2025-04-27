import { NextFunction, Request, Response } from "express";
import Role, { IRole, IPermissions } from "../models/Role.model";
import ErrorResponse from "../utils/error-response.utils";


const ACTIONS = ["create", "update", "delete", "manage"] as const;
type PermissionActions = typeof ACTIONS[number];

// helper to sanitize permissions payload
function sanitizePermissions(input: any): IPermissions | null {
    if (
        typeof input !== "object" ||
        input === null ||
        Array.isArray(input)
    ) {
        return null;
    }

    const out: IPermissions = {};
    for (const [resource, rawPerms] of Object.entries(input)) {
        if (typeof rawPerms !== "object" || rawPerms === null) {
            out[resource] = null;
            continue;
        }

        const permsMap = rawPerms as Record<string, unknown>;
        const clean: Partial<Record<PermissionActions, boolean>> = {};

        for (const action of ACTIONS) {
            if (permsMap[action] === true) {
                clean[action] = true;
            }
        }

        out[resource] = clean;
    }
    return out;
}


// @desc    Create a new role
// @route   POST /api/v1/roles
export const createRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.body.name) {
            return next(new ErrorResponse("Role name is required", 400));
        }
        const payload: IRole = {
            name: req.body.name as string,
            permissions: sanitizePermissions(req.body.permissions),
        };
        const role = await Role.create(payload);
        res.status(201).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating role", 500));
    }
};

// @desc    Get all roles
// @route   GET /api/v1/roles
export const getAllRoles = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
export const getRoleById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
export const updateRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        const updates: Partial<IRole> = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.permissions !== undefined) {
            updates.permissions = sanitizePermissions(req.body.permissions);
        }

        await role.update(updates);
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating role", 500));
    }
};

// @desc    Delete a role
// @route   DELETE /api/v1/roles/:id
export const deleteRole = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        await role.destroy();
        res
            .status(200)
            .json({ success: true, message: "Role deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting role", 500));
    }
};
