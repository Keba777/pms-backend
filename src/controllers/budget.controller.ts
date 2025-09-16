import { Request, Response, NextFunction } from "express";
import Budget from "../models/Budget.model";
import Project from "../models/Project.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create budget
// @route   POST /api/v1/budgets
const createBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const budget = await Budget.create(req.body);
        const createdBudget = await Budget.findByPk(budget.id, { include: [Project] });
        res.status(201).json({ success: true, data: createdBudget });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating budget", 500));
    }
};

// @desc    Get all budgets
// @route   GET /api/v1/budgets
const getAllBudgets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const budgets = await Budget.findAll({
            include: [Project],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ success: true, data: budgets });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving budgets", 500));
    }
};

// @desc    Get budget by ID
// @route   GET /api/v1/budgets/:id
const getBudgetById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const budget = await Budget.findByPk(req.params.id, { include: [Project] });
        if (!budget) return next(new ErrorResponse("Budget not found", 404));
        res.status(200).json({ success: true, data: budget });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving budget", 500));
    }
};

// @desc    Update budget
// @route   PUT /api/v1/budgets/:id
const updateBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const budget = await Budget.findByPk(req.params.id);
        if (!budget) return next(new ErrorResponse("Budget not found", 404));
        await budget.update(req.body);
        const updatedBudget = await Budget.findByPk(budget.id, { include: [Project] });
        res.status(200).json({ success: true, data: updatedBudget });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating budget", 500));
    }
};

// @desc    Delete budget
// @route   DELETE /api/v1/budgets/:id
const deleteBudget = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const budget = await Budget.findByPk(req.params.id);
        if (!budget) return next(new ErrorResponse("Budget not found", 404));
        await budget.destroy();
        res.status(200).json({ success: true, message: "Budget deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting budget", 500));
    }
};

export { createBudget, getAllBudgets, getBudgetById, updateBudget, deleteBudget };
