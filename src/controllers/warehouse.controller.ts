import { NextFunction, Request, Response } from "express";
import Warehouse from "../models/Warehouse.model";
import ErrorResponse from "../utils/error-response.utils";
import Site from "../models/Site.model";
import { ReqWithUser } from "../types/req-with-user";

// @desc    Create a new warehouse
// @route   POST /api/v1/warehouses
export const createWarehouse = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const payload = {
            ...req.body,
            orgId: req.user?.orgId,
            siteId: req.body.siteId || req.user?.siteId
        };

        if (!payload.siteId) {
            return next(new ErrorResponse("Site ID is required", 400));
        }

        const warehouse = await Warehouse.create(payload);
        res.status(201).json({ success: true, data: warehouse });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating warehouse", 500));
    }
};

// @desc    Get all warehouses
// @route   GET /api/v1/warehouses
export const getAllWarehouses = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const where: any = {};

        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = user?.orgId;
        }

        const warehouses = await Warehouse.findAll({
            where,
            include: [
                {
                    model: Site,
                    as: "site",
                    attributes: ["id", "name"],
                },
            ]
        });
        res.status(200).json({ success: true, data: warehouses });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving warehouses", 500));
    }
};

// @desc    Get a warehouse by ID
// @route   GET /api/v1/warehouses/:id
export const getWarehouseById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id as string, {
            include: [
                {
                    model: Site,
                    as: "site",
                    attributes: ["id", "name"],
                },
            ]
        });

        if (!warehouse) {
            return next(new ErrorResponse("Warehouse not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && warehouse.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to access this warehouse", 403));
        }

        res.status(200).json({ success: true, data: warehouse });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving warehouse", 500));
    }
};

// @desc    Update a warehouse
// @route   PUT /api/v1/warehouses/:id
export const updateWarehouse = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id as string);
        if (!warehouse) {
            return next(new ErrorResponse("Warehouse not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && warehouse.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this warehouse", 403));
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
export const deleteWarehouse = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const warehouse = await Warehouse.findByPk(req.params.id as string);
        if (!warehouse) {
            return next(new ErrorResponse("Warehouse not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && warehouse.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to delete this warehouse", 403));
        }

        await warehouse.destroy();
        res.status(200).json({ success: true, message: "Warehouse deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting warehouse", 500));
    }
};
