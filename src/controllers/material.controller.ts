import { NextFunction, Request, Response } from "express";
import Material from "../models/Material.model";
import ErrorResponse from "../utils/error-response.utils";
import Warehouse from "../models/Warehouse.model";

// @desc    Create a new material
// @route   POST /api/v1/materials
export const createMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const material = await Material.create(req.body);
        res.status(201).json({ success: true, data: material });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating material", 500));
    }
};

// @desc    Get all materials
// @route   GET /api/v1/materials
export const getAllMaterials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const materials = await Material.findAll({
            include: [{ model: Warehouse, as: 'warehouse' }]
        });
        res.status(200).json({ success: true, data: materials });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving materials", 500));
    }
};

// @desc    Get a material by ID
// @route   GET /api/v1/materials/:id
export const getMaterialById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) {
            return next(new ErrorResponse("Material not found", 404));
        }
        res.status(200).json({ success: true, data: material });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving material", 500));
    }
};

// @desc    Update a material
// @route   PUT /api/v1/materials/:id
export const updateMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) {
            return next(new ErrorResponse("Material not found", 404));
        }
        await material.update(req.body);
        res.status(200).json({ success: true, data: material });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating material", 500));
    }
};

// @desc    Delete a material
// @route   DELETE /api/v1/materials/:id
export const deleteMaterial = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const material = await Material.findByPk(req.params.id);
        if (!material) {
            return next(new ErrorResponse("Material not found", 404));
        }
        await material.destroy();
        res.status(200).json({ success: true, message: "Material deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting material", 500));
    }
};
