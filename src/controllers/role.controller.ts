import { NextFunction, Response } from "express";
import Role, { IRole, IPermissions } from "../models/Role.model";
import ErrorResponse from "../utils/error-response.utils";
import { ReqWithUser } from "../types/req-with-user";
import { Op } from "sequelize";


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
    req: ReqWithUser,
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
            orgId: req.user?.orgId,
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
    req: ReqWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;
        const where: any = {};

        // If not SystemAdmin
        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            // Show global roles or org roles
            where[Op.or] = [
                { orgId: user?.orgId },
                { orgId: null }
            ];

            // Exclude "SystemAdmin" role from the list so they can't assign it (even if it's global)
            where.name = {
                [Op.not]: "SystemAdmin" // Check case sensitivity if needed, maybe ilike or lower? 
                // Usually roles are proper case "SystemAdmin". 
                // Safe enough to exclude exact match for now, or use Op.iLike if postgres.
            };
        }

        const roles = await Role.findAll({ where });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving roles", 500));
    }
};

// @desc    Get a role by ID
// @route   GET /api/v1/roles/:id
export const getRoleById = async (
    req: ReqWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        const user = req.user;
        // Allow if role is global (null orgId) OR user is SystemAdmin OR user belongs to same org
        // Global roles (like SystemAdmin role itself) have orgId=null.
        // We should allow users to see global roles?? Typically yes, or maybe not.
        // For now, let's assume they can see global roles or their own org roles.
        const isGlobal = !role.orgId;
        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";
        const isSameOrg = user?.orgId && role.orgId === user.orgId;

        if (!isGlobal && !isSystemAdmin && !isSameOrg) {
            return next(new ErrorResponse("Not authorized to access this role", 403));
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
    req: ReqWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        const user = req.user;
        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";

        // Only SystemAdmin can update global roles
        if (!role.orgId && !isSystemAdmin) {
            return next(new ErrorResponse("Not authorized to update global roles", 403));
        }

        // Regular admins can only update their own org roles
        if (role.orgId && !isSystemAdmin && role.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this role", 403));
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
    req: ReqWithUser,
    res: Response,
    next: NextFunction
) => {
    try {
        const role = await Role.findByPk(req.params.id);
        if (!role) {
            return next(new ErrorResponse("Role not found", 404));
        }

        const user = req.user;
        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";

        // Only SystemAdmin can delete global roles
        if (!role.orgId && !isSystemAdmin) {
            return next(new ErrorResponse("Not authorized to delete global roles", 403));
        }

        // Regular admins can only delete their own org roles
        if (role.orgId && !isSystemAdmin && role.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to delete this role", 403));
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

