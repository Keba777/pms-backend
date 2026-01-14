import { NextFunction, Response } from "express";
import { ReqWithUser } from "../types/req-with-user";
import Department from "../models/Department.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new department
// @route   POST /api/v1/departments
export const createDepartment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const payload = {
            ...req.body,
            orgId: req.user?.orgId
        };
        const department = await Department.create(payload);
        res.status(201).json({ success: true, data: department });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating department", 500));
    }
};

// @desc    Get all departments
// @route   GET /api/v1/departments
export const getAllDepartments = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const where: any = {};

        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            where.orgId = user?.orgId;
        }

        const departments = await Department.findAll({ where });
        res.status(200).json({ success: true, data: departments });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving departments", 500));
    }
};

// @desc    Get a department by ID
// @route   GET /api/v1/departments/:id
export const getDepartmentById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const department = await Department.findByPk(req.params.id as string);
        if (!department) {
            return next(new ErrorResponse("Department not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && department.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to access this department", 403));
        }

        res.status(200).json({ success: true, data: department });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving department", 500));
    }
};

// @desc    Update a department
// @route   PUT /api/v1/departments/:id
export const updateDepartment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const department = await Department.findByPk(req.params.id as string);
        if (!department) {
            return next(new ErrorResponse("Department not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && department.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to update this department", 403));
        }

        await department.update(req.body);
        res.status(200).json({ success: true, data: department });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating department", 500));
    }
};

// @desc    Delete a department
// @route   DELETE /api/v1/departments/:id
export const deleteDepartment = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const department = await Department.findByPk(req.params.id as string);
        if (!department) {
            return next(new ErrorResponse("Department not found", 404));
        }

        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin" && department.orgId !== user?.orgId) {
            return next(new ErrorResponse("Not authorized to delete this department", 403));
        }

        await department.destroy();
        res.status(200).json({ success: true, message: "Department deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting department", 500));
    }
};

