import { NextFunction, Request, Response } from "express";
import Warehouse from "../models/Warehouse.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new warehouse
// @route   POST /api/v1/warehouses
export const createWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.create(req.body);
        res.status(201).json({ success: true, data: warehouse });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating warehouse", 500));
    }
};

// @desc    Get all warehouses
// @route   GET /api/v1/warehouses
export const getAllWarehouses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const warehouses = await Warehouse.findAll();
        res.status(200).json({ success: true, data: warehouses });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving warehouses", 500));
    }
};

// @desc    Get a warehouse by ID
// @route   GET /api/v1/warehouses/:id
export const getWarehouseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id);
        if (!warehouse) {
            return next(new ErrorResponse("Warehouse not found", 404));
        }
        res.status(200).json({ success: true, data: warehouse });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving warehouse", 500));
    }
};

// @desc    Update a warehouse
// @route   PUT /api/v1/warehouses/:id
export const updateWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id);
        if (!warehouse) {
            return next(new ErrorResponse("Warehouse not found", 404));
        }
        await warehouse.update(req.body);
        res.status(200).json({ success: true, data: warehouse });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating warehouse", 500));
    }
};

// @desc    Delete a warehouse
// @route   DELETE /api/v1/warehouses/:id
export const deleteWarehouse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id);
        if (!warehouse) {
            return next(new ErrorResponse("Warehouse not found", 404));
        }
        await warehouse.destroy();
        res.status(200).json({ success: true, message: "Warehouse deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting warehouse", 500));
    }
};
