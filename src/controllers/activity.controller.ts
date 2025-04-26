import { NextFunction, Request, Response } from "express";
import Activity from "../models/Activity.model";
import ErrorResponse from "../utils/error-response.utils";
import RequestModel from "../models/Request.model";
import User from "../models/User.model";

// @desc    Create a new activity
// @route   POST /api/v1/activities
const createActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...activityData } = req.body;
        const activity = await Activity.create(activityData);
        if (assignedUsers?.length) {
            // Validate users exist
            const users = await User.findAll({
                where: {
                    id: assignedUsers,
                },
            });

            if (users.length !== assignedUsers.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }
            await activity.$set("assignedUsers", users);
        }
        const createdActivity = await Activity.findByPk(activity.id, {
            include: [
                {
                    model: RequestModel,
                    as: "requests",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });
        res.status(201).json({ success: true, data: createdActivity });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating activity", 500));
    }
};

// @desc    Get all activities with associated requests and assigned users
// @route   GET /api/v1/activities
const getAllActivities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activities = await Activity.findAll({
            include: [
                {
                    model: RequestModel,
                    as: "requests",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: activities });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving activities", 500));
    }
};

// @desc    Get an activity by ID with associated materials, equipment, and labors
// @route   GET /api/v1/activities/:id
const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activity = await Activity.findByPk(req.params.id, {
            include: [
                {
                    model: RequestModel,
                    as: "requests",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],

        }
        );
        if (!activity) {
            return next(new ErrorResponse("Activity not found", 404));
        }
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving activity", 500));
    }
};

// @desc    Update an activity
// @route   PUT /api/v1/activities/:id
const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assignedUsers, ...activityData } = req.body;

        const activity = await Activity.findByPk(req.params.id);
        if (!activity) {
            return next(new ErrorResponse("Activity not found", 404));
        }

        await activity.update(activityData);

        if (Array.isArray(assignedUsers)) {
            const users = await User.findAll({
                where: {
                    id: assignedUsers,
                },
            });

            if (users.length !== assignedUsers.length) {
                return next(new ErrorResponse("Some users could not be found", 400));
            }

            await activity.$set("assignedUsers", users);
        }

        const updatedActivity = await Activity.findByPk(activity.id, {
            include: [
                {
                    model: RequestModel,
                    as: "requests",
                },
                {
                    model: User,
                    as: "assignedUsers",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({ success: true, data: updatedActivity });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating activity", 500));
    }
};

// @desc    Delete an activity
// @route   DELETE /api/v1/activities/:id
const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) {
            return next(new ErrorResponse("Activity not found", 404));
        }

        await activity.destroy();
        res.status(200).json({ success: true, message: "Activity deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting activity", 500));
    }
};

export { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity };
