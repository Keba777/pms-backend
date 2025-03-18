import { NextFunction, Request, Response } from "express";
import Project from "../models/Project.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new project
// @route   POST /api/v1/projects
const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.create(req.body);
        res.status(201).json({ success: true, data: project });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating project", 500));
    }
};

// @desc    Get all projects
// @route   GET /api/v1/projects
const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json({ success: true, data: projects });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving projects", 500));
    }
};

// @desc    Get a project by ID
// @route   GET /api/v1/projects/:id
const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await Project.findByPk(req.params.id);
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
        const project = await Project.findByPk(req.params.id);
        if (!project) {
            return next(new ErrorResponse("Project not found", 404));
        }

        await project.update(req.body);
        res.status(200).json({ success: true, data: project });
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
