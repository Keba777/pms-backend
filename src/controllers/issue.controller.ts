import { NextFunction, Response } from "express";
import { ReqWithUser } from "../types/req-with-user";
import Issue from "../models/Issue.model";
import Site from "../models/Site.model";
import Department from "../models/Department.model";
import Activity from "../models/Activity.model";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new issue
// @route   POST /api/v1/issues
const createIssue = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const issueData = {
            ...req.body,
            orgId: req.user?.orgId
        };
        const issue = await Issue.create(issueData);
        res.status(201).json({ success: true, data: issue });
    } catch (error: any) {
        console.error(error);
        next(new ErrorResponse(error.message || "Error creating issue", 500));
    }
};

// @desc    Get all issues (with all related objects)
// @route   GET /api/v1/issues
const getAllIssues = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const where: any = {};

        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = user?.orgId;
        }

        const issues = await Issue.findAll({
            where,
            include: [
                { model: Site, as: "site" },
                { model: Department, as: "department" },
                { model: Activity, as: "activity" },
                { model: Project, as: "project" },
                { model: Task, as: "task" },
                { model: User, as: "raisedBy" },
                { model: User, as: "responsible" },
            ],
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json({ success: true, data: issues });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving issues", 500));
    }
};

// @desc    Get an issue by ID (with all related objects)
// @route   GET /api/v1/issues/:id
const getIssueById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const issue = await Issue.findByPk(req.params.id as string, {
            include: [
                { model: Site, as: "site" },
                { model: Department, as: "department" },
                { model: Activity, as: "activity" },
                { model: Project, as: "project" },
                { model: Task, as: "task" },
                { model: User, as: "raisedBy" },
                { model: User, as: "responsible" },
            ],
        });

        if (!issue) {
            return next(new ErrorResponse("Issue not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && issue.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to access this issue", 403));
        }

        res.status(200).json({ success: true, data: issue });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving issue", 500));
    }
};

// @desc    Update an issue by ID
// @route   PUT /api/v1/issues/:id
const updateIssue = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const issue = await Issue.findByPk(req.params.id as string);
        if (!issue) {
            return next(new ErrorResponse("Issue not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && issue.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this issue", 403));
        }

        await issue.update(req.body);

        // reload with all associations included
        const updated = await Issue.findByPk(issue.id, {
            include: [
                { model: Site, as: "site" },
                { model: Department, as: "department" },
                { model: Activity, as: "activity" },
                { model: Project, as: "project" },
                { model: Task, as: "task" },
                { model: User, as: "raisedBy" },
                { model: User, as: "responsible" },
            ],
        });

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating issue", 500));
    }
};

// @desc    Delete an issue by ID
// @route   DELETE /api/v1/issues/:id
const deleteIssue = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const issue = await Issue.findByPk(req.params.id as string);
        if (!issue) {
            return next(new ErrorResponse("Issue not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && issue.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to delete this issue", 403));
        }

        await issue.destroy();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting issue", 500));
    }
};

// @desc    Get all issues raised by a specific user (with related objects)
// @route   GET /api/v1/issues/user/:userId
const getIssuesByRaisedById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const targetUser = await User.findByPk(req.params.userId as string);

        if (!targetUser) {
            return next(new ErrorResponse("User not found", 404));
        }

        if (user?.role?.name?.toLowerCase() !== "systemadmin" && targetUser.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to view issues for this user", 403));
        }

        const issues = await Issue.findAll({
            where: { raisedById: req.params.userId as string, orgId: targetUser.orgId as any },
            include: [
                { model: Site, as: "site" },
                { model: Department, as: "department" },
                { model: Activity, as: "activity" },
                { model: Project, as: "project" },
                { model: Task, as: "task" },
                { model: User, as: "raisedBy" },
                { model: User, as: "responsible" },
            ],
            order: [["createdAt", "ASC"]],
        });

        if (!issues.length) {
            return next(new ErrorResponse("No issues found for this user", 404));
        }

        res.status(200).json({ success: true, data: issues });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving issues", 500));
    }
};

export {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    getIssuesByRaisedById,
};
