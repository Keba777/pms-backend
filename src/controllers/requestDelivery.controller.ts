import { NextFunction, Request, Response } from "express";
import RequestDelivery from "../models/RequestDelivery.model";
import Site from "../models/Site.model";
import Approval from "../models/Approval.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new request delivery
// @route   POST /api/v1/request-deliveries
export const createRequestDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDelivery = await RequestDelivery.create(req.body);
        res.status(201).json({ success: true, data: requestDelivery });
    } catch (error: any) {
        console.error(error);
        next(new ErrorResponse(error.message || "Error creating request delivery", 500));
    }
};

// @desc    Get all request deliveries
// @route   GET /api/v1/request-deliveries
export const getAllRequestDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDeliveries = await RequestDelivery.findAll({
            include: [
                { model: Approval, as: "approval" },
                { model: Site, as: "site" },
            ],
            order: [["deliveryDate", "ASC"]],
        });
        res.status(200).json({ success: true, data: requestDeliveries });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving request deliveries", 500));
    }
};

// @desc    Get a request delivery by ID
// @route   GET /api/v1/request-deliveries/:id
export const getRequestDeliveryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDelivery = await RequestDelivery.findByPk(req.params.id as string, {
            include: [
                { model: Approval, as: "approval" },
                { model: Site, as: "site" },
            ],
        });

        if (!requestDelivery) {
            return next(new ErrorResponse("Request delivery not found", 404));
        }

        res.status(200).json({ success: true, data: requestDelivery });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving request delivery", 500));
    }
};

// @desc    Update a request delivery by ID
// @route   PUT /api/v1/request-deliveries/:id
export const updateRequestDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDelivery = await RequestDelivery.findByPk(req.params.id as string);
        if (!requestDelivery) {
            return next(new ErrorResponse("Request delivery not found", 404));
        }

        const updatedRequestDelivery = await requestDelivery.update(req.body);
        res.status(200).json({ success: true, data: updatedRequestDelivery });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating request delivery", 500));
    }
};

// @desc    Delete a request delivery by ID
// @route   DELETE /api/v1/request-deliveries/:id
export const deleteRequestDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestDelivery = await RequestDelivery.findByPk(req.params.id as string);
        if (!requestDelivery) {
            return next(new ErrorResponse("Request delivery not found", 404));
        }

        await requestDelivery.destroy();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting request delivery", 500));
    }
};