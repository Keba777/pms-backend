import { NextFunction, Response } from "express";
import { ReqWithUser } from "../types/req-with-user";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import Activity from "../models/Activity.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";
import Site from "../models/Site.model";
import Client from "../models/Client.model";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import notificationService from "../services/notificationService";

// @desc    Create a new project
// @route   POST /api/v1/projects
const createProject = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { members, ...projectData } = req.body;

        // Handle file uploads
        const files = (req.files as Express.Multer.File[]) || [];
        const attachmentUrls: string[] = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "project_attachments",
                resource_type: "auto",
            });
            fs.unlinkSync(file.path);
            attachmentUrls.push(result.secure_url);
        }

        const projectPayload = {
            ...projectData,
            attachments: attachmentUrls,
            orgId: req.user?.orgId
        };

        const project = (await Project.create(projectPayload, { userId: req.user?.id } as any)) as any;

        const membersList = Array.isArray(members) ? members : (members ? [members] : []);

        if (membersList.length > 0) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: membersList
                }
            });

            if (users.length !== membersList.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }
            await project.$set("members", users);
        }

        const createdProject = await Project.findByPk(project.id, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                        },
                    ],
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] }
                },
                {
                    model: Site,
                    as: "projectSite"
                },
                {
                    model: Client,
                    as: "clientInfo"
                }
            ]
        });

        // Send notifications to project members
        if (membersList.length > 0 && createdProject) {
            const addedBy = req.user?.first_name + ' ' + req.user?.last_name || 'Someone';
            for (const userId of membersList) {
                notificationService.notifyProjectAssigned(
                    userId,
                    createdProject.id,
                    createdProject.title || 'Untitled Project',
                    addedBy
                ).catch(err => console.error('Notification error:', err));
            }
        }

        res.status(201).json({ success: true, data: createdProject });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating project", 500));
    }
};

// @desc    Get all projects (with tasks, activities, and members), sorted by creation date
// @route   GET /api/v1/projects
const getAllProjects = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const where: any = {};

        // If not SystemAdmin, filter by orgId
        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = user?.orgId;
        }

        const projects = await Project.findAll({
            where,
            include: [
                {
                    model: Task,
                    as: "tasks",
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                        },
                    ],
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: Site,
                    as: "projectSite"
                },
                {
                    model: Client,
                    as: "clientInfo"
                }
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving projects", 500));
    }
};

// @desc    Get a project by ID (with tasks, activities, and members)
// @route   GET /api/v1/projects/:id
const getProjectById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByPk(req.params.id as string, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                        },
                    ],
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: Site,
                    as: "projectSite"
                },
                {
                    model: Client,
                    as: "clientInfo"
                }
            ],
        });

        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && project.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to access this project", 403));
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving project", 500));
    }
};

// @desc    Update a project
// @route   PUT /api/v1/projects/:id
const updateProject = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const { members, existingAttachments, ...projectData } = req.body;
        const project = await Project.findByPk(req.params.id as string);

        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && project.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this project", 403));
        }

        // Handle file uploads (new files)
        const files = (req.files as Express.Multer.File[]) || [];
        const newAttachmentUrls: string[] = [];

        for (const file of files) {
            const result = await cloudinary.uploader.upload(file.path, {
                folder: "project_attachments",
                resource_type: "auto",
            });
            fs.unlinkSync(file.path);
            newAttachmentUrls.push(result.secure_url);
        }

        // Handle existing attachments
        let keptAttachments: string[] = [];
        if (existingAttachments) {
            // If coming from FormData, it might be a single string or an array of strings
            keptAttachments = Array.isArray(existingAttachments)
                ? existingAttachments
                : [existingAttachments];
        }

        const updatedAttachments = [...keptAttachments, ...newAttachmentUrls];

        await project.update({
            ...projectData,
            attachments: updatedAttachments
        }, { userId: req.user?.id } as any);

        const membersList = Array.isArray(members) ? members : (members ? [members] : []);

        if (membersList.length > 0) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: membersList
                }
            });

            if (users.length !== membersList.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }
            await project.$set("members", users);
        }

        const updatedProject = await Project.findByPk(project.id, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                        },
                    ],
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: Site,
                    as: "projectSite"
                },
                {
                    model: Client,
                    as: "clientInfo"
                }
            ],
        });

        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating project", 500));
    }
};


// @desc    Delete a project
// @route   DELETE /api/v1/projects/:id
const deleteProject = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByPk(req.params.id as string);
        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && project.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to delete this project", 403));
        }

        await project.destroy();
        res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting project", 500));
    }
};

// @desc    Update project actuals
// @route   PATCH /api/v1/projects/:id/actuals
// Expected body: { actuals: { start_date, end_date, progress, status, budget } }
const updateProjectActuals = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByPk(req.params.id as string);
        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && project.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this project", 403));
        }

        const { actuals } = req.body;
        if (!actuals) {
            return next(new ErrorResponse("No actuals data provided", 400));
        }

        // Optional: shallow validation for allowed fields only
        const allowedFields = ["start_date", "end_date", "progress", "status", "budget"];
        const sanitized: any = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(actuals, key)) {
                sanitized[key] = actuals[key];
            }
        }

        // Update project.actuals (replace entire actuals object)
        await project.update({ actuals: sanitized });

        const updatedProject = await Project.findByPk(project.id, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                        },
                    ],
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: Site,
                    as: "projectSite"
                },
                {
                    model: Client,
                    as: "clientInfo"
                }
            ],
        });

        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating project actuals", 500));
    }
};

/**
 * @desc    Update project progress
 * @route   PUT /api/v1/projects/:id/progress
 * @body    { progress: number, remark?, status?, checkedBy?, approvedBy?, action?, summaryReport?, comment?, approvedDate?, dateTime? }
 */
const updateProjectProgress = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    const t = await Project.sequelize?.transaction();
    try {
        const project = await Project.findByPk(req.params.id as string, { transaction: t });
        if (!project) {
            if (t) await t.rollback();
            return next(new ErrorResponse("Project not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && project.orgId !== user?.orgId) {
            if (t) await t.rollback();
            return next(new ErrorResponse("Not authorized to update this project", 403));
        }

        const {
            progress,
            remark,
            status,
            checkedBy,
            approvedBy,
            action,
            summaryReport,
            comment,
            approvedDate,
            dateTime,
        } = req.body;

        if (typeof progress !== "number") {
            if (t) await t.rollback();
            return next(new ErrorResponse("progress (number) is required", 400));
        }

        const progressUpdate: any = {
            id: undefined,
            dateTime: dateTime || new Date().toISOString(),
            fromProgress: project.getDataValue("progress"),
            progress,
            remark,
            status,
            checkedBy,
            approvedBy,
            action,
            summaryReport,
            comment,
            approvedDate: approvedDate ?? null,
            userId: (req as any).user?.id || req.body.userId,
        };

        const updatePayload: any = { progress };
        if (checkedBy) updatePayload.checked_by_name = checkedBy;

        await project.update(updatePayload, {
            transaction: t,
            userId: (req as any).user?.id || req.body.userId,
            progressUpdate,
        });

        if (t) await t.commit();

        const updatedProject = await Project.findByPk(project.id, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                    include: [
                        {
                            model: Activity,
                            as: "activities",
                        },
                    ],
                },
                { model: User, as: "members", through: { attributes: [] }, attributes: { exclude: ["password"] } },
                {
                    model: Site,
                    as: "projectSite"
                },
                {
                    model: Client,
                    as: "clientInfo"
                }
            ],
        });

        res.status(200).json({ success: true, data: updatedProject });
    } catch (error) {
        console.error(error);
        if (t) await t.rollback();
        next(new ErrorResponse("Error updating project progress", 500));
    }
};

export {
    createProject,
    getAllProjects,
    getProjectById,
    updateProject,
    deleteProject,
    updateProjectActuals,
    updateProjectProgress,
};
