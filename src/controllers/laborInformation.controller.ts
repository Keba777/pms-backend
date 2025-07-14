import { NextFunction, Request, Response } from "express";
import LaborInformation from "../models/LaborInformation.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new labor information
// @route   POST /api/v1/labor-informations
export const createLaborInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laborInformation = await LaborInformation.create(req.body);
        res.status(201).json({ success: true, data: laborInformation });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating labor information", 500));
    }
};

// @desc    Get all labor informations
// @route   GET /api/v1/labor-informations
export const getAllLaborInformations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laborInformations = await LaborInformation.findAll();
        res.status(200).json({ success: true, data: laborInformations });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving labor informations", 500));
    }
};

// @desc    Get a labor information by ID
// @route   GET /api/v1/labor-informations/:id
export const getLaborInformationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laborInformation = await LaborInformation.findByPk(req.params.id);
        if (!laborInformation) {
            return next(new ErrorResponse("Labor information not found", 404));
        }
        res.status(200).json({ success: true, data: laborInformation });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving labor information", 500));
    }
};

// @desc    Update a labor information
// @route   PUT /api/v1/labor-informations/:id
export const updateLaborInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laborInformation = await LaborInformation.findByPk(req.params.id);
        if (!laborInformation) {
            return next(new ErrorResponse("Labor information not found", 404));
        }
        await laborInformation.update(req.body);
        res.status(200).json({ success: true, data: laborInformation });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating labor information", 500));
    }
};

// @desc    Delete a labor information
// @route   DELETE /api/v1/labor-informations/:id
export const deleteLaborInformation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const laborInformation = await LaborInformation.findByPk(req.params.id);
        if (!laborInformation) {
            return next(new ErrorResponse("Labor information not found", 404));
        }
        await laborInformation.destroy();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting labor information", 500));
    }
};