// controllers/approval.controller.ts
import { NextFunction, Request, Response } from "express";
import ApprovalModel from "../models/Approval.model";
import ErrorResponse from "../utils/error-response.utils";
import Department from "../models/Department.model";
import User from "../models/User.model";
import RequestModel from "../models/Request.model";
import Activity from "../models/Activity.model"; 

// @desc    Create a new approval
// @route   POST /api/v1/approvals
const createApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approval = await ApprovalModel.create(req.body);
    res.status(201).json({ success: true, data: approval });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error creating approval", 500));
  }
};

// @desc    Get all approvals
// @route   GET /api/v1/approvals
const getAllApprovals = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approvals = await ApprovalModel.findAll({
      include: [
        {
          model: RequestModel,
          as: "request",
          // include activity so approval.request.activity will be available
          include: [
            {
              model: Activity,
              as: "activity",
              attributes: ["id", "activity_name"],
            },
          ],
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "approvedByUser",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: User,
          as: "checkedByUser",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Department,
          as: "prevDepartment",
          attributes: ["id", "name"],
        },
        {
          model: Department,
          as: "nextDepartment",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json({ success: true, data: approvals });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving approvals", 500));
  }
};

// @desc    Get an approval by ID
// @route   GET /api/v1/approvals/:id
const getApprovalById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approval = await ApprovalModel.findByPk(req.params.id, {
      include: [
        {
          model: RequestModel,
          as: "request",
          include: [
            {
              model: Activity,
              as: "activity",
              attributes: ["id", "activity_name"],
            },
          ],
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "approvedByUser",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: User,
          as: "checkedByUser",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Department,
          as: "prevDepartment",
          attributes: ["id", "name"],
        },
        {
          model: Department,
          as: "nextDepartment",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!approval) {
      return next(new ErrorResponse("Approval not found", 404));
    }

    res.status(200).json({ success: true, data: approval });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving approval", 500));
  }
};

// @desc    Update an approval by ID
// @route   PUT /api/v1/approvals/:id
const updateApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approval = await ApprovalModel.findByPk(req.params.id);

    if (!approval) {
      return next(new ErrorResponse("Approval not found", 404));
    }

    await approval.update(req.body);
    res.status(200).json({ success: true, data: approval });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error updating approval", 500));
  }
};

// @desc    Delete an approval by ID
// @route   DELETE /api/v1/approvals/:id
const deleteApproval = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const approval = await ApprovalModel.findByPk(req.params.id);

        if (!approval) {
            return next(new ErrorResponse("Approval not found", 404));
        }

        await approval.destroy();
        res.status(204).json({ success: true, data: null });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting approval", 500));
    }
}

// @desc    Get all approvals by request ID
// @route   GET /api/v1/approvals/request/:requestId
const getApprovalsByRequestId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const approvals = await ApprovalModel.findAll({
      where: { requestId: req.params.requestId },
      include: [
        {
          model: RequestModel,
          as: "request",
          include: [
            {
              model: Activity,
              as: "activity",
              attributes: ["id", "activity_name"],
            },
          ],
        },
        {
          model: Department,
          as: "department",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "approvedByUser",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: User,
          as: "checkedByUser",
          attributes: ["id", "first_name", "last_name", "email"],
        },
        {
          model: Department,
          as: "prevDepartment",
          attributes: ["id", "name"],
        },
        {
          model: Department,
          as: "nextDepartment",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    if (!approvals) {
      return next(new ErrorResponse("Approvals not found", 404));
    }

    res.status(200).json({ success: true, data: approvals });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error retrieving approvals", 500));
  }
};

export {
  createApproval,
  getAllApprovals,
  getApprovalById,
  updateApproval,
  deleteApproval,
  getApprovalsByRequestId,
};
