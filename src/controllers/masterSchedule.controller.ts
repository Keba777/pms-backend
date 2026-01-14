import { NextFunction, Request, Response } from "express";
import MasterSchedule from "../models/MasterSchedule.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new master schedule entry
// @route   POST /api/v1/master-schedule
const createMasterSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const masterSchedule = await MasterSchedule.create(req.body);
        res.status(201).json({ success: true, data: masterSchedule });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating master schedule", 500));
    }
};

// @desc    Get all master schedule entries
// @route   GET /api/v1/master-schedule
const getAllMasterSchedules = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const masterSchedules = await MasterSchedule.findAll();
        res.status(200).json({ success: true, data: masterSchedules });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving master schedules", 500));
    }
};

// @desc    Get a master schedule entry by ID
// @route   GET /api/v1/master-schedule/:id
const getMasterScheduleById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const masterSchedule = await MasterSchedule.findByPk(req.params.id as string);
        if (!masterSchedule) {
            return next(new ErrorResponse("Master schedule entry not found", 404));
        }

        res.status(200).json({ success: true, data: masterSchedule });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving master schedule", 500));
    }
};

// @desc    Update a master schedule entry
// @route   PUT /api/v1/master-schedule/:id
const updateMasterSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const masterSchedule = await MasterSchedule.findByPk(req.params.id as string);
        if (!masterSchedule) {
            return next(new ErrorResponse("Master schedule entry not found", 404));
        }

        await masterSchedule.update(req.body);
        res.status(200).json({ success: true, data: masterSchedule });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating master schedule", 500));
    }
};

// @desc    Delete a master schedule entry
// @route   DELETE /api/v1/master-schedule/:id
const deleteMasterSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const masterSchedule = await MasterSchedule.findByPk(req.params.id as string);
        if (!masterSchedule) {
            return next(new ErrorResponse("Master schedule entry not found", 404));
        }

        await masterSchedule.destroy();
        res.status(200).json({ success: true, message: "Master schedule entry deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting master schedule", 500));
    }
};

export { createMasterSchedule, getAllMasterSchedules, getMasterScheduleById, updateMasterSchedule, deleteMasterSchedule };
