import { Response, NextFunction } from "express";
import { ReqWithUser } from "../types/req-with-user";
import ErrorResponse from "../utils/error-response.utils";

/**
 * Middleware to enforce multi-tenancy.
 * Ensures the user has an orgId and potentially scopes future database queries.
 */
export const multiTenancy = (req: ReqWithUser, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
        return next(new ErrorResponse("Not authorized to access this route", 401));
    }

    // SystemAdmin can see everything
    if (user.role?.name?.toLowerCase() === "systemadmin") {
        return next();
    }

    // SuperAdmin and regular users MUST have an orgId
    if (!user.orgId) {
        return next(new ErrorResponse("User is not associated with any organization", 403));
    }

    // For now, we just ensure it exists. 
    // Controllers will use req.user.orgId to filter queries.
    // In a more advanced setup, we could use Sequelize CLS (Continuation Local Storage)
    // to automatically apply a scope to all queries in this request.

    next();
};
