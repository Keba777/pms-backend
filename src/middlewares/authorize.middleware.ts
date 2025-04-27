import { Request, Response, NextFunction } from "express";
import Role, { IPermissions, PermissionActions } from "../models/Role.model";
import User from "../models/User.model";

// Extending Express.Request to guarantee we have a User model on `req.user`
export type ReqWithUser = Request & { user?: User };

/**
 * @param action   one of "create"|"update"|"delete"|"manage"
 * @param resource the key in your permissions JSON (e.g. "projects", "tasks")
 */
export function authorize(action: PermissionActions, resource: string) {
    return async (req: ReqWithUser, res: Response, next: NextFunction) => {
        // 1) Must be authenticated
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // 2) Load the Role (with its JSON `permissions`)
        const role = await Role.findByPk(user.role_id);
        if (!role) {
            return res.status(403).json({ message: "Role not found" });
        }

        if (role.name.toLowerCase() === "admin") {
            return next();
        }

        // 3) Grab the permissions object for this resource (could be null or undefined)
        const permsForResource =
            (role.permissions as IPermissions | null)?.[resource] ?? {};

        // 4) Check the specific action flag (true only if explicitly set)
        const allowed =
            (permsForResource as Record<PermissionActions, boolean>)[action] === true;

        if (!allowed) {
            return res
                .status(403)
                .json({ message: "Forbidden: insufficient permissions" });
        }

        // 5) All good, proceed
        next();
    };
}
