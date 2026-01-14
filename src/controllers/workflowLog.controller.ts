import { NextFunction, Request, Response } from "express";
import { ReqWithUser } from "../types/req-with-user";
import WorkflowLog from "../models/WorkflowLog.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new workflow log
// @route   POST /api/v1/workflow-logs
const createWorkflowLog = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { entityType, entityId, action, status, details } = req.body;
        if (!req.user || !req.user.id) {
            return next(new ErrorResponse("User not authenticated", 401));
        }
        const userId = req.user.id; // Assuming protectRoute middleware adds user to req

        // Validate entityType
        if (!["Project", "Task", "Activity", "Approval"].includes(entityType)) {
            return next(new ErrorResponse("Invalid entity type", 400));
        }

        // Validate user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        const log = await WorkflowLog.create({
            entityType,
            entityId,
            action,
            status,
            userId,
            details,
        });

        const createdLog = await WorkflowLog.findByPk(log.id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(201).json({ success: true, data: createdLog });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating workflow log", 500));
    }
};

// @desc    Get all workflow logs for a specific entity (e.g., Project, Task)
// @route   GET /api/v1/workflow-logs/:entityType/:entityId
const getWorkflowLogsByEntity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { entityType, entityId } = req.params as { entityType: string; entityId: string };

        // Validate entityType
        if (!["Project", "Task", "Activity", "Approval"].includes(entityType)) {
            return next(new ErrorResponse("Invalid entity type", 400));
        }

        const logs = await WorkflowLog.findAll({
            where: {
                entityType,
                entityId,
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: { exclude: ["password"] },
                },
            ],
            order: [["timestamp", "DESC"]], // Sort by most recent
        });

        res.status(200).json({ success: true, data: logs });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving workflow logs", 500));
    }
};

export { createWorkflowLog, getWorkflowLogsByEntity };