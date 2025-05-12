import { NextFunction, Request, Response } from "express";
import RequestModel from "../models/Request.model";
import Site from "../models/Site.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new request
// @route   POST /api/v1/requests
const createRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.create(req.body);
    res.status(201).json({ success: true, data: request });
  } catch (error: any) {
    console.error(error);
    next(new ErrorResponse(error.message || "Error creating request", 500));
  }
};

// @desc    Get all requests (with site object)
// @route   GET /api/v1/requests
const getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await RequestModel.findAll({
      include: [
        {
          model: Site,
          as: "site",
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving requests", 500));
  }
};

// @desc    Get a request by ID (with site object)
// @route   GET /api/v1/requests/:id
const getRequestById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.findByPk(req.params.id, {
      include: [
        {
          model: Site,
          as: "site",
        },
      ],
    });

    if (!request) {
      return next(new ErrorResponse("Request not found", 404));
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving request", 500));
  }
};

// @desc    Update a request by ID
// @route   PUT /api/v1/requests/:id
const updateRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.findByPk(req.params.id);
    if (!request) {
      return next(new ErrorResponse("Request not found", 404));
    }

    await request.update(req.body);

    // reload with site included
    const updated = await RequestModel.findByPk(request.id, {
      include: [{ model: Site, as: "site" }],
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error updating request", 500));
  }
};

// @desc    Delete a request by ID
// @route   DELETE /api/v1/requests/:id
const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await RequestModel.findByPk(req.params.id);
    if (!request) {
      return next(new ErrorResponse("Request not found", 404));
    }

    await request.destroy();
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error deleting request", 500));
  }
};

// @desc    Get all requests by user ID (with site object)
// @route   GET /api/v1/requests/user/:userId
const getRequestsByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await RequestModel.findAll({
      where: { userId: req.params.userId },
      include: [{ model: Site, as: "site" }],
      order: [["createdAt", "ASC"]],
    });

    if (!requests.length) {
      return next(new ErrorResponse("No requests found for this user", 404));
    }

    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving requests", 500));
  }
};

export {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestsByUserId,
};
