import { NextFunction, Response } from "express";
import Client from "../models/Client.model";
import Project from "../models/Project.model";
import Site from "../models/Site.model";
import ErrorResponse from "../utils/error-response.utils";
import { ReqWithUser } from "../types/req-with-user";

// @desc    Create a new client
// @route   POST /api/v1/clients
const createClient = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        // System Admins cannot create clients (they don't belong to an org)
        if (user?.role?.name?.toLowerCase() === "systemadmin") {
            return next(new ErrorResponse("System Admins cannot create clients", 403));
        }

        // Automatically set orgId from user's organization
        const clientData = {
            ...req.body,
            orgId: user?.orgId
        };

        const client = await Client.create(clientData);
        res.status(201).json({ success: true, data: client });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating client", 500));
    }
};

// @desc    Get all clients (with projects and their sites) - filtered by organization
// @route   GET /api/v1/clients
const getAllClients = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        // System Admins see no clients (they don't belong to an org)
        if (user?.role?.name?.toLowerCase() === "systemadmin") {
            return res.status(200).json({ success: true, data: [] });
        }

        const clients = await Client.findAll({
            where: {
                orgId: user?.orgId
            },
            include: [
                {
                    model: Project,
                    include: [
                        {
                            model: Site,
                            as: "projectSite"
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({ success: true, data: clients });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving clients", 500));
    }
};

// @desc    Get a client by ID
// @route   GET /api/v1/clients/:id
const getClientById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";

        const whereClause: any = { id: req.params.id };

        // Non-system admins can only see clients from their org
        if (!isSystemAdmin) {
            whereClause.orgId = user?.orgId;
        }

        const client = await Client.findOne({
            where: whereClause,
            include: [
                {
                    model: Project,
                    include: [
                        {
                            model: Site,
                            as: "projectSite"
                        }
                    ]
                }
            ]
        });

        if (!client) {
            return next(new ErrorResponse("Client not found", 404));
        }

        res.status(200).json({ success: true, data: client });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving client", 500));
    }
};

// @desc    Update a client
// @route   PUT /api/v1/clients/:id
const updateClient = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";

        const whereClause: any = { id: req.params.id };

        // Non-system admins can only update clients from their org
        if (!isSystemAdmin) {
            whereClause.orgId = user?.orgId;
        }

        const client = await Client.findOne({ where: whereClause });

        if (!client) {
            return next(new ErrorResponse("Client not found", 404));
        }

        // Prevent changing orgId
        const { orgId, ...updateData } = req.body;

        await client.update(updateData);

        const updatedClient = await Client.findByPk(client.id, {
            include: [
                {
                    model: Project,
                    include: [
                        {
                            model: Site,
                            as: "projectSite"
                        }
                    ]
                }
            ]
        });

        res.status(200).json({ success: true, data: updatedClient });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating client", 500));
    }
};

// @desc    Delete a client
// @route   DELETE /api/v1/clients/:id
const deleteClient = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        const isSystemAdmin = user?.role?.name?.toLowerCase() === "systemadmin";

        const whereClause: any = { id: req.params.id };

        // Non-system admins can only delete clients from their org
        if (!isSystemAdmin) {
            whereClause.orgId = user?.orgId;
        }

        const client = await Client.findOne({ where: whereClause });

        if (!client) {
            return next(new ErrorResponse("Client not found", 404));
        }

        await client.destroy();
        res.status(200).json({ success: true, message: "Client deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting client", 500));
    }
};

export {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
};

