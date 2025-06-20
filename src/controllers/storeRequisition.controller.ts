import { NextFunction, Request, Response } from "express";
import StoreRequisition from "../models/StoreRequisition.model";
import Approval from "../models/Approval.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new store requisition
// @route   POST /api/v1/store-requisitions
export const createStoreRequisition = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sr = await StoreRequisition.create(req.body);
        res.status(201).json({ success: true, data: sr });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating store requisition", 500));
    }
};

// @desc    Get all store requisitions (with approval object)
// @route   GET /api/v1/store-requisitions
export const getAllStoreRequisitions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const list = await StoreRequisition.findAll({
            include: [{ model: Approval, as: "approval" }],
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json({ success: true, data: list });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse("Error retrieving store requisitions", 500));
    }
};

// @desc    Get a store requisition by ID (with approval)
// @route   GET /api/v1/store-requisitions/:id
export const getStoreRequisitionById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sr = await StoreRequisition.findByPk(req.params.id, {
            include: [{ model: Approval, as: "approval" }],
        });
        if (!sr) {
            return next(new ErrorResponse("Store requisition not found", 404));
        }
        res.status(200).json({ success: true, data: sr });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse("Error retrieving store requisition", 500));
    }
};

// @desc    Update a store requisition by ID
// @route   PUT /api/v1/store-requisitions/:id
export const updateStoreRequisition = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sr = await StoreRequisition.findByPk(req.params.id);
        if (!sr) {
            return next(new ErrorResponse("Store requisition not found", 404));
        }

        await sr.update(req.body);

        const updated = await StoreRequisition.findByPk(sr.id, {
            include: [{ model: Approval, as: "approval" }],
        });

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse("Error updating store requisition", 500));
    }
};

// @desc    Delete a store requisition by ID
// @route   DELETE /api/v1/store-requisitions/:id
export const deleteStoreRequisition = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const sr = await StoreRequisition.findByPk(req.params.id);
        if (!sr) {
            return next(new ErrorResponse("Store requisition not found", 404));
        }
        await sr.destroy();
        res.status(204).json({ success: true, data: null });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse("Error deleting store requisition", 500));
    }
};
