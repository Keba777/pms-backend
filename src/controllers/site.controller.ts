import { NextFunction, Request, Response } from "express";
import Site from "../models/Site.model";
import Project from "../models/Project.model";
import ErrorResponse from "../utils/error-response.utils";
import Warehouse from "../models/Warehouse.model";
import Equipment from "../models/Equipment.model";
import Labor from "../models/Labor.model";

// @desc    Create a new site
// @route   POST /api/v1/sites
const createSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const site = await Site.create(req.body);
        res.status(201).json({ success: true, data: site });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating site", 500));
    }
};

// @desc    Get all sites (with projects)
// @route   GET /api/v1/sites
const getAllSites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sites = await Site.findAll({
            include: [
                {
                    model: Project,
                    as: "projects",
                },
                {
                    model: Warehouse,
                    as: "warehouses"
                },
                {
                    model: Equipment,
                    as: "equipments"
                },
                {
                    model: Labor,
                    as: "labors"
                }
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: sites });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving sites", 500));
    }
};

// @desc    Get a site by ID (with projects)
// @route   GET /api/v1/sites/:id
const getSiteById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const site = await Site.findByPk(req.params.id, {
            include: [
                {
                    model: Project,
                    as: "projects",
                },
                {
                    model: Warehouse,
                    as: "warehouses"
                },
                {
                    model: Equipment,
                    as: "equipments"
                },
                {
                    model: Labor,
                    as: "labors"
                }
            ],
        });

        if (!site) {
            return next(new ErrorResponse("Site not found", 404));
        }

        res.status(200).json({ success: true, data: site });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving site", 500));
    }
};

// @desc    Update a site
// @route   PUT /api/v1/sites/:id
const updateSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const site = await Site.findByPk(req.params.id);
        if (!site) {
            return next(new ErrorResponse("Site not found", 404));
        }

        await site.update({ name });

        const updatedSite = await Site.findByPk(site.id, {
            include: [
                {
                    model: Project,
                    as: "projects",
                },
                {
                    model: Warehouse,
                    as: "warehouses"
                },
                {
                    model: Equipment,
                    as: "equipments"
                },
                {
                    model: Labor,
                    as: "labors"
                }
            ],
        });

        res.status(200).json({ success: true, data: updatedSite });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating site", 500));
    }
};

// @desc    Delete a site
// @route   DELETE /api/v1/sites/:id
const deleteSite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const site = await Site.findByPk(req.params.id);
        if (!site) {
            return next(new ErrorResponse("Site not found", 404));
        }

        await site.destroy();
        res.status(200).json({ success: true, message: "Site deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting site", 500));
    }
};

export { createSite, getAllSites, getSiteById, updateSite, deleteSite };
