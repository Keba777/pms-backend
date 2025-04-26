import { NextFunction, Request, Response } from "express";
import Project from "../models/Project.model";
import Task from "../models/Task.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new project
// @route   POST /api/v1/projects
const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { members, ...projectData } = req.body;
        const project = await Project.create(projectData);

        if (members?.length) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: members
                }
            });

            if (users.length !== members.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }
            await project.$set("members", users);
        }

        const createdProject = await Project.findByPk(project.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] }
                }
            ]
        });

        res.status(201).json({ success: true, data: createdProject });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating project", 500));
    }
};

// @desc    Get all projects (with tasks and members), sorted by creation date
// @route   GET /api/v1/projects
const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: Task,
                    as: "tasks",
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving projects", 500));
    }
};

// @desc    Get a project by ID (with tasks and members)
// @route   GET /api/v1/projects/:id
const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        res.status(200).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving project", 500));
    }
};

// @desc    Update a project
// @route   PUT /api/v1/projects/:id
const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { members, ...projectData } = req.body;

        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        await project.update(projectData);

        if (Array.isArray(members) && members.length > 0) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: members
                }
            });

            if (users.length !== members.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }
            await project.$set("members", users);
        }

        const updatedProject = await Project.findByPk(project.id, {
            include: [
                {
                    model: Task,
                    as: "tasks",
                },
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
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
const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        await project.destroy();
        res.status(200).json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting project", 500));
    }
};

export { createProject, getAllProjects, getProjectById, updateProject, deleteProject };
