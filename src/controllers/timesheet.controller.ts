import { NextFunction, Request, Response } from "express";
import ErrorResponse from "../utils/error-response.utils";
import { EquipmentTimesheet, LaborTimesheet, MaterialBalanceSheet } from "../models/Timesheet.model";
import User from "../models/User.model";
import LaborInformation from "../models/LaborInformation.model";


// ===== Labor Timesheet Controllers =====
export const createLaborEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await LaborTimesheet.create(req.body);
        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating labor entry", 500));
    }
};

export const getAllLaborEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entries = await LaborTimesheet.findAll({
            include: [
                { model: User, as: 'user' },
                { model: LaborInformation, as: 'laborInformation' }
            ]
        });
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching labor entries", 500));
    }
};

export const getLaborEntryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await LaborTimesheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Labor entry not found", 404));
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching labor entry", 500));
    }
};

export const updateLaborEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await LaborTimesheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Labor entry not found", 404));
        await entry.update(req.body);
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating labor entry", 500));
    }
};

export const deleteLaborEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await LaborTimesheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Labor entry not found", 404));
        await entry.destroy();
        res.status(200).json({ success: true, message: "Labor entry deleted" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting labor entry", 500));
    }
};

// ===== Equipment Timesheet Controllers =====
export const createEquipmentEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await EquipmentTimesheet.create(req.body);
        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating equipment entry", 500));
    }
};

export const getAllEquipmentEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entries = await EquipmentTimesheet.findAll();
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching equipment entries", 500));
    }
};

export const getEquipmentEntryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await EquipmentTimesheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Equipment entry not found", 404));
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching equipment entry", 500));
    }
};

export const updateEquipmentEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await EquipmentTimesheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Equipment entry not found", 404));
        await entry.update(req.body);
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating equipment entry", 500));
    }
};

export const deleteEquipmentEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await EquipmentTimesheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Equipment entry not found", 404));
        await entry.destroy();
        res.status(200).json({ success: true, message: "Equipment entry deleted" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting equipment entry", 500));
    }
};

// ===== Material Balance Controllers =====
export const createMaterialEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await MaterialBalanceSheet.create(req.body);
        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating material entry", 500));
    }
};

export const getAllMaterialEntries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entries = await MaterialBalanceSheet.findAll();
        res.status(200).json({ success: true, data: entries });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching material entries", 500));
    }
};

export const getMaterialEntryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await MaterialBalanceSheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Material entry not found", 404));
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching material entry", 500));
    }
};

export const updateMaterialEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await MaterialBalanceSheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Material entry not found", 404));
        await entry.update(req.body);
        res.status(200).json({ success: true, data: entry });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating material entry", 500));
    }
};

export const deleteMaterialEntry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const entry = await MaterialBalanceSheet.findByPk(req.params.id);
        if (!entry) return next(new ErrorResponse("Material entry not found", 404));
        await entry.destroy();
        res.status(200).json({ success: true, message: "Material entry deleted" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting material entry", 500));
    }
};

