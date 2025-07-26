import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/error-response.utils";
import KPI from "../models/KPI.model";
import User from "../models/User.model";
import LaborInformation from "../models/LaborInformation.model";
import Equipment from "../models/Equipment.model";

// @desc    Create a new kpi
// @route   POST /api/v1/kpis
const createKPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const kpi = await KPI.create(req.body);
        res.status(201).json({ success: true, data: kpi });
    } catch (error: any) {
        console.error(error);
        next(new ErrorResponse(error.message || "Error creating KPI", 500));
    }
}

// @desc    Get all kpis (with all related objects)
// @route   GET /api/v1/kpis
const getAllKPIs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const kpis = await KPI.findAll({
            include: [
                { model: User, as: "userLabor" },
                { model: LaborInformation, as: "laborInformation" },
                { model: Equipment, as: "equipment" },
            ],
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json({ success: true, data: kpis });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving KPIs", 500));
    }
}

// @desc    Get a kpi by ID (with all related objects)
// @route   GET /api/v1/kpis/:id
const getKPIById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const kpi = await KPI.findByPk(req.params.id, {
            include: [
                { model: User, as: "userLabor" },
                { model: LaborInformation, as: "laborInformation" },
                { model: Equipment, as: "equipment" },
            ],
        });
        if (!kpi) {
            return next(new ErrorResponse("KPI not found", 404));
        }
        res.status(200).json({ success: true, data: kpi });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving KPI", 500));
    }
}

// @desc    Update a kpi by ID
// @route   PUT /api/v1/kpis/:id
const updateKPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const kpi = await KPI.findByPk(req.params.id);
        if (!kpi) {
            return next(new ErrorResponse("KPI not found", 404));
        }

        // Update the KPI with the new data
        await kpi.update(req.body);
        res.status(200).json({ success: true, data: kpi });
    } catch (error: any) {
        console.error(error);
        next(new ErrorResponse(error.message || "Error updating KPI", 500));
    }
}

// @desc    Delete a kpi by ID
// @route   DELETE /api/v1/kpis/:id
const deleteKPI = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const kpi = await KPI.findByPk(req.params.id);
        if (!kpi) {
            return next(new ErrorResponse("KPI not found", 404));
        }

        // Delete the KPI
        await kpi.destroy();
        res.status(204).json({ success: true, message: "KPI deleted successfully" });
    } catch (error: any) {
        console.error(error);
        next(new ErrorResponse(error.message || "Error deleting KPI", 500));
    }
}

export { createKPI, getAllKPIs, getKPIById, updateKPI, deleteKPI };