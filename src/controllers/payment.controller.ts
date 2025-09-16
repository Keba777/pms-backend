import { Request, Response, NextFunction } from "express";
import Payment from "../models/Payment.model";
import Invoice from "../models/Invoice.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create payment
// @route   POST /api/v1/payments
const createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.create(req.body);
        const createdPayment = await Payment.findByPk(payment.id, {
            include: [Invoice, User],
        });
        res.status(201).json({ success: true, data: createdPayment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating payment", 500));
    }
};

// @desc    Get all payments
// @route   GET /api/v1/payments
const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payments = await Payment.findAll({
            include: [Invoice, User],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ success: true, data: payments });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving payments", 500));
    }
};

// @desc    Get payment by ID
// @route   GET /api/v1/payments/:id
const getPaymentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.findByPk(req.params.id, {
            include: [Invoice, User],
        });
        if (!payment) return next(new ErrorResponse("Payment not found", 404));
        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving payment", 500));
    }
};

// @desc    Update payment
// @route   PUT /api/v1/payments/:id
const updatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return next(new ErrorResponse("Payment not found", 404));
        await payment.update(req.body);
        const updatedPayment = await Payment.findByPk(payment.id, {
            include: [Invoice, User],
        });
        res.status(200).json({ success: true, data: updatedPayment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating payment", 500));
    }
};

// @desc    Delete payment
// @route   DELETE /api/v1/payments/:id
const deletePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) return next(new ErrorResponse("Payment not found", 404));
        await payment.destroy();
        res.status(200).json({ success: true, message: "Payment deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting payment", 500));
    }
};

export { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment };
