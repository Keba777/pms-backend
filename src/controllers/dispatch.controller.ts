import { NextFunction, Request, Response } from "express";
import Dispatch from "../models/Dispatch.model";
import ErrorResponse from "../utils/error-response.utils";
import Approval from "../models/Approval.model";
import Site from "../models/Site.model";

// @desc    Create a new dispatch
// @route   POST /api/v1/dispatches
export const createDispatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dispatch = await Dispatch.create(req.body);
        res.status(201).json({ success: true, data: dispatch });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating dispatch", 500));
    }
};

// @desc    Get all dispatches
// @route   GET /api/v1/dispatches
export const getAllDispatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dispatches = await Dispatch.findAll({
            include: [
                { model: Approval, as: "approval" },
                { model: Site, as: "depatureSite" },
                { model: Site, as: "arrivalSite" },
            ],
            order: [["dispatchedDate", "ASC"]],
        });
        res.status(200).json({ success: true, data: dispatches });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving dispatches", 500));
    }
};

// @desc    Get a dispatch by ID
// @route   GET /api/v1/dispatches/:id
export const getDispatchById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dispatch = await Dispatch.findByPk(req.params.id, {
            include: [
                { model: Approval, as: "approval" },
                { model: Site, as: "depatureSite" },
                { model: Site, as: "arrivalSite" },
            ],
        });

        if (!dispatch) {
            return next(new ErrorResponse("Dispatch not found", 404));
        }

        res.status(200).json({ success: true, data: dispatch });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving dispatch", 500));
    }
};

// @desc    Update a dispatch by ID
// @route   PUT /api/v1/dispatches/:id
export const updateDispatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dispatch = await Dispatch.findByPk(req.params.id);
        if (!dispatch) {
            return next(new ErrorResponse("Dispatch not found", 404));
        }

        await dispatch.update(req.body);
        res.status(200).json({ success: true, data: dispatch });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating dispatch", 500));
    }
};

// @desc    Delete a dispatch by ID
// @route   DELETE /api/v1/dispatches/:id
export const deleteDispatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dispatch = await Dispatch.findByPk(req.params.id);
        if (!dispatch) {
            return next(new ErrorResponse("Dispatch not found", 404));
        }

        await dispatch.destroy();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting dispatch", 500));
    }
};