import { Request, Response, NextFunction } from "express";
import Payroll from "../models/Payroll.model";
import Project from "../models/Project.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create payroll
// @route   POST /api/v1/payrolls
const createPayroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payroll = await Payroll.create(req.body);
        const createdPayroll = await Payroll.findByPk(payroll.id, {
            include: [Project, User],
        });
        res.status(201).json({ success: true, data: createdPayroll });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating payroll", 500));
    }
};

// @desc    Get all payrolls
// @route   GET /api/v1/payrolls
const getAllPayrolls = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payrolls = await Payroll.findAll({
            include: [Project, User],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ success: true, data: payrolls });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving payrolls", 500));
    }
};

// @desc    Get payroll by ID
// @route   GET /api/v1/payrolls/:id
const getPayrollById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payroll = await Payroll.findByPk(req.params.id, {
            include: [Project, User],
        });
        if (!payroll) return next(new ErrorResponse("Payroll not found", 404));
        res.status(200).json({ success: true, data: payroll });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving payroll", 500));
    }
};

// @desc    Update payroll
// @route   PUT /api/v1/payrolls/:id
const updatePayroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payroll = await Payroll.findByPk(req.params.id);
        if (!payroll) return next(new ErrorResponse("Payroll not found", 404));
        await payroll.update(req.body);
        const updatedPayroll = await Payroll.findByPk(payroll.id, {
            include: [Project, User],
        });
        res.status(200).json({ success: true, data: updatedPayroll });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating payroll", 500));
    }
};

// @desc    Delete payroll
// @route   DELETE /api/v1/payrolls/:id
const deletePayroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payroll = await Payroll.findByPk(req.params.id);
        if (!payroll) return next(new ErrorResponse("Payroll not found", 404));
        await payroll.destroy();
        res.status(200).json({ success: true, message: "Payroll deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting payroll", 500));
    }
};

export { createPayroll, getAllPayrolls, getPayrollById, updatePayroll, deletePayroll };
