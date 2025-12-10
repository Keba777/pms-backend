import { NextFunction, Request, Response } from "express";
import Client from "../models/Client.model";
import Project from "../models/Project.model";
import Site from "../models/Site.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new client
// @route   POST /api/v1/clients
const createClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await Client.create(req.body);
        res.status(201).json({ success: true, data: client });
    } catch (err: any) {
        console.error(err);
        next(new ErrorResponse(err.message || "Error creating client", 500));
    }
};

// @desc    Get all clients (with projects and their sites)
// @route   GET /api/v1/clients
const getAllClients = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clients = await Client.findAll({
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
const getClientById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await Client.findByPk(req.params.id, {
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
const updateClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await Client.findByPk(req.params.id);
        if (!client) {
            return next(new ErrorResponse("Client not found", 404));
        }

        await client.update(req.body);

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
const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await Client.findByPk(req.params.id);
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
