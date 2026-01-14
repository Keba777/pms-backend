import { Response, NextFunction } from "express";
import Payment from "../models/Payment.model";
import Invoice from "../models/Invoice.model";
import User from "../models/User.model";
import Project from "../models/Project.model";
import Notification from "../models/Notification.model";
import ProjectMember from "../models/ProjectMember.model";
import ErrorResponse from "../utils/error-response.utils";
import { ReqWithUser } from "../types/req-with-user";

// @desc    Create payment
// @route   POST /api/v1/payments
const createPayment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const paymentData = {
            ...req.body,
            recorded_by: req.user?.id,
            orgId: req.user?.orgId
        };
        const payment = await Payment.create(paymentData);
        const createdPayment = await Payment.findByPk(payment.id, {
            include: [Invoice, User],
        });

        if (createdPayment && createdPayment.invoice) {
            const invoice = createdPayment.invoice;
            const project = await Project.findByPk(invoice.project_id);

            if (project) {
                const members = await ProjectMember.findAll({
                    where: { project_id: project.id }
                });

                const notifications = members.map(member => ({
                    user_id: member.userId,
                    type: "Financial: Payment Logged",
                    data: {
                        paymentId: payment.id,
                        projectTitle: project.title,
                        amount: payment.amount_paid,
                        reason: payment.reason,
                        message: `A payment of ETB ${payment.amount_paid} for project "${project.title}" has been logged.${payment.reason ? ` Reason: ${payment.reason}` : ""}`
                    },
                    orgId: project.orgId
                }));

                if (notifications.length > 0) {
                    await Notification.bulkCreate(notifications);
                }
            }
        }

        res.status(201).json({ success: true, data: createdPayment });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating payment", 500));
    }
};

// @desc    Get all payments
// @route   GET /api/v1/payments
const getAllPayments = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const where: any = {};
        if (req.user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = req.user?.orgId;
        }

        const payments = await Payment.findAll({
            where,
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
const getPaymentById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.findByPk(req.params.id as string, {
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
const updatePayment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.findByPk(req.params.id as string);
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
const deletePayment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const payment = await Payment.findByPk(req.params.id as string);
        if (!payment) return next(new ErrorResponse("Payment not found", 404));
        await payment.destroy();
        res.status(200).json({ success: true, message: "Payment deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting payment", 500));
    }
};

export { createPayment, getAllPayments, getPaymentById, updatePayment, deletePayment };
