import { NextFunction, Response } from "express";
import Organization from "../models/Organization.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";
import { ReqWithUser } from "../types/req-with-user";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import path from "path";
import Role from "../models/Role.model";

// @desc    Get all organizations
// @route   GET /api/v1/organizations
// @access  Private/SystemAdmin (or specific permissions)
const getAllOrganizations = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const where: any = {};

        // If not SystemAdmin, filter by orgId
        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            // If they have an orgId, restrict to it. 
            // If they are a global user (not SystemAdmin?) - shouldn't happen for now.
            if (user?.orgId) {
                where.id = user.orgId;
            } else {
                // If no orgId and not SystemAdmin, arguably they see nothing or error?
                // Let's assume they see nothing.
                return res.status(200).json({ success: true, data: [] });
            }
        }

        const organizations = await Organization.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ["id"],
                }
            ]
        });
        res.status(200).json({ success: true, data: organizations });
    } catch (err: any) {
        next(new ErrorResponse(err.message || "Error fetching organizations", 500));
    }
};

// @desc    Get organization by ID
// @route   GET /api/v1/organizations/:id
// @access  Private (Scoped)
const getOrganizationById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const id = req.params.id;

        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";

        // If not SystemAdmin, they can only see their own org
        if (!isSystemAdmin && user?.orgId !== id) {
            return next(new ErrorResponse("Not authorized to access this organization", 403));
        }

        const organization = await Organization.findByPk(id);
        if (!organization) {
            return next(new ErrorResponse("Organization not found", 404));
        }

        res.status(200).json({ success: true, data: organization });
    } catch (err: any) {
        next(new ErrorResponse(err.message || "Error fetching organization", 500));
    }
};

// @desc    Create new organization
// @route   POST /api/v1/organizations
// @access  Private/SystemAdmin
const createOrganization = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            return next(new ErrorResponse("Only SystemAdmin can create organizations", 403));
        }

        const organization = await Organization.create(req.body);
        res.status(201).json({ success: true, data: organization });
    } catch (err: any) {
        next(new ErrorResponse(err.message || "Error creating organization", 500));
    }
};

// @desc    Update organization branding
// @route   PUT /api/v1/organizations/:id
// @access  Private/SystemAdmin OR SuperAdmin for their own org
const updateOrganization = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const id = req.params.id;

        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";
        // Allow if SystemAdmin OR (user belongs to this org AND has manage capability - implied by reaching this controller via route auth, but let's be strict about ID match)
        const isSameOrg = user?.orgId === id;

        if (!isSystemAdmin && !isSameOrg) {
            return next(new ErrorResponse("Not authorized to update this organization", 403));
        }

        const organization = await Organization.findByPk(id);
        if (!organization) {
            return next(new ErrorResponse("Organization not found", 404));
        }

        const updates = { ...req.body };

        // Handle file uploads (logo, favicon)
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files) {
            if (files.logo) {
                const logo = files.logo[0];
                const result = await cloudinary.uploader.upload(path.resolve(logo.path), {
                    folder: "org_branding",
                    resource_type: "auto",
                });
                fs.unlinkSync(logo.path);
                updates.logo = result.secure_url;
            }
            if (files.favicon) {
                const favicon = files.favicon[0];
                const result = await cloudinary.uploader.upload(path.resolve(favicon.path), {
                    folder: "org_branding",
                    resource_type: "auto",
                });
                fs.unlinkSync(favicon.path);
                updates.favicon = result.secure_url;
            }
        }

        await organization.update(updates);
        res.status(200).json({ success: true, data: organization });
    } catch (err: any) {
        next(new ErrorResponse(err.message || "Error updating organization", 500));
    }
};

// @desc    Delete organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private/SystemAdmin
const deleteOrganization = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            return next(new ErrorResponse("Only SystemAdmin can delete organizations", 403));
        }

        const organization = await Organization.findByPk(req.params.id);
        if (!organization) {
            return next(new ErrorResponse("Organization not found", 404));
        }

        await organization.destroy();
        res.status(200).json({ success: true, message: "Organization deleted" });
    } catch (err: any) {
        next(new ErrorResponse(err.message || "Error deleting organization", 500));
    }
};

// @desc    Create Super Admin for organization
// @route   POST /api/v1/organizations/:id/create-superadmin
// @access  Private/SystemAdmin only
const createSuperAdmin = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const orgId = req.params.id;

        // Only System Admin can create Super Admins
        if (user?.role?.name?.toLowerCase() !== "systemadmin") {
            return next(new ErrorResponse("Only SystemAdmin can create Super Admins", 403));
        }

        const organization = await Organization.findByPk(orgId);
        if (!organization) {
            return next(new ErrorResponse("Organization not found", 404));
        }

        const { first_name, last_name, email, phone, password } = req.body;

        // Validate required fields
        if (!first_name || !last_name || !email || !phone) {
            return next(new ErrorResponse("Please provide all required fields", 400));
        }

        // Check if user with email already exists
        const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
        if (existingUser) {
            return next(new ErrorResponse("User with this email already exists", 400));
        }

        // Find SuperAdmin role
        const superAdminRole = await Role.findOne({ where: { name: "SuperAdmin" } });
        if (!superAdminRole) {
            return next(new ErrorResponse("SuperAdmin role not found in system", 500));
        }

        // Create the Super Admin user
        const newSuperAdmin = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            phone,
            password: password || "123456", // Default password
            role_id: superAdminRole.id,
            orgId: orgId,
            status: "Active",
            gender: "Male", // Default
        });

        res.status(201).json({
            success: true,
            message: `Super Admin created successfully for ${organization.orgName}`,
            data: {
                id: newSuperAdmin.id,
                first_name: newSuperAdmin.first_name,
                last_name: newSuperAdmin.last_name,
                email: newSuperAdmin.email,
                phone: newSuperAdmin.phone,
                role: superAdminRole.name,
                organization: organization.orgName,
            }
        });
    } catch (err: any) {
        next(new ErrorResponse(err.message || "Error creating Super Admin", 500));
    }
};

export {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createSuperAdmin
};
