import { Response, NextFunction } from "express";
import Invoice from "../models/Invoice.model";
import Payment from "../models/Payment.model";
import Project from "../models/Project.model";
import User from "../models/User.model";
import Notification from "../models/Notification.model";
import ProjectMember from "../models/ProjectMember.model";
import ErrorResponse from "../utils/error-response.utils";
import { ReqWithUser } from "../types/req-with-user";

// @desc    Create new invoice
// @route   POST /api/v1/invoices
const createInvoice = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const invoiceData = {
            ...req.body,
            created_by: req.user?.id,
            orgId: req.user?.orgId
        };
        const invoice = await Invoice.create(invoiceData);
        const createdInvoice = await Invoice.findByPk(invoice.id, {
            include: [Project, User, Payment],
        });

        if (createdInvoice && createdInvoice.project) {
            const project = createdInvoice.project;

            // Find Project Members to notify (PMs)
            const members = await ProjectMember.findAll({
                where: { project_id: project.id }
            });

            const notifications = members.map(member => ({
                user_id: member.userId,
                type: "Financial: Invoice Created",
                data: {
                    invoiceId: invoice.id,
                    projectTitle: project.title,
                    amount: invoice.amount,
                    message: `A new invoice/IPC for project "${project.title}" has been created.`
                },
                orgId: project.orgId
            }));

            if (notifications.length > 0) {
                await Notification.bulkCreate(notifications);
            }
        }

        res.status(201).json({ success: true, data: createdInvoice });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating invoice", 500));
    }
};

// @desc    Get all invoices
// @route   GET /api/v1/invoices
const getAllInvoices = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const where: any = {};
        if (req.user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = req.user?.orgId;
        }

        const invoices = await Invoice.findAll({
            where,
            include: [Project, User, Payment],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ success: true, data: invoices });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving invoices", 500));
    }
};

// @desc    Get invoice by ID
// @route   GET /api/v1/invoices/:id
const getInvoiceById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [Project, User, Payment],
        });
        if (!invoice) return next(new ErrorResponse("Invoice not found", 404));
        res.status(200).json({ success: true, data: invoice });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving invoice", 500));
    }
};

// @desc    Update invoice
// @route   PUT /api/v1/invoices/:id
const updateInvoice = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return next(new ErrorResponse("Invoice not found", 404));
        await invoice.update(req.body);
        const updatedInvoice = await Invoice.findByPk(invoice.id, {
            include: [Project, User, Payment],
        });
        res.status(200).json({ success: true, data: updatedInvoice });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating invoice", 500));
    }
};

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
const deleteInvoice = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);
        if (!invoice) return next(new ErrorResponse("Invoice not found", 404));
        await invoice.destroy();
        res.status(200).json({ success: true, message: "Invoice deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting invoice", 500));
    }
};

export { createInvoice, getAllInvoices, getInvoiceById, updateInvoice, deleteInvoice };
