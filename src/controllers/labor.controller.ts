import { NextFunction, Request, Response } from "express";
import Labor from "../models/Labor.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new labor
// @route   POST /api/v1/labors
export const createLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.create(req.body);
        res.status(201).json({ success: true, data: labor });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating labor", 500));
    }
};

// @desc    Get all labors
// @route   GET /api/v1/labors
export const getAllLabors = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labors = await Labor.findAll();
        res.status(200).json({ success: true, data: labors });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving labors", 500));
    }
};

// @desc    Get a labor by ID
// @route   GET /api/v1/labors/:id
export const getLaborById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) {
            return next(new ErrorResponse("Labor not found", 404));
        }
        res.status(200).json({ success: true, data: labor });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving labor", 500));
    }
};

// @desc    Update a labor
// @route   PUT /api/v1/labors/:id
export const updateLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) {
            return next(new ErrorResponse("Labor not found", 404));
        }
        await labor.update(req.body);
        res.status(200).json({ success: true, data: labor });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating labor", 500));
    }
};

// @desc    Delete a labor
// @route   DELETE /api/v1/labors/:id
export const deleteLabor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const labor = await Labor.findByPk(req.params.id);
        if (!labor) {
            return next(new ErrorResponse("Labor not found", 404));
        }
        await labor.destroy();
        res.status(200).json({ success: true, message: "Labor deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting labor", 500));
    }
};
