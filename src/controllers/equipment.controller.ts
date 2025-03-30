import { NextFunction, Request, Response } from "express";
import Equipment from "../models/Equipment.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new equipment
// @route   POST /api/v1/equipments
export const createEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json({ success: true, data: equipment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating equipment", 500));
    }
};

// @desc    Get all equipments
// @route   GET /api/v1/equipments
export const getAllEquipments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipments = await Equipment.findAll();
        res.status(200).json({ success: true, data: equipments });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving equipments", 500));
    }
};

// @desc    Get an equipment by ID
// @route   GET /api/v1/equipments/:id
export const getEquipmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipment = await Equipment.findByPk(req.params.id);
        if (!equipment) {
            return next(new ErrorResponse("Equipment not found", 404));
        }
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving equipment", 500));
    }
};

// @desc    Update an equipment
// @route   PUT /api/v1/equipments/:id
export const updateEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipment = await Equipment.findByPk(req.params.id);
        if (!equipment) {
            return next(new ErrorResponse("Equipment not found", 404));
        }
        await equipment.update(req.body);
        res.status(200).json({ success: true, data: equipment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating equipment", 500));
    }
};

// @desc    Delete an equipment
// @route   DELETE /api/v1/equipments/:id
export const deleteEquipment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const equipment = await Equipment.findByPk(req.params.id);
        if (!equipment) {
            return next(new ErrorResponse("Equipment not found", 404));
        }
        await equipment.destroy();
        res.status(200).json({ success: true, message: "Equipment deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting equipment", 500));
    }
};
