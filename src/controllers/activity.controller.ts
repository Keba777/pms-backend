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

// @desc    Update activity actuals
// @route   PATCH /api/v1/activities/:id/actuals
const updateActivityActuals = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activity = await Activity.findByPk(req.params.id);
        if (!activity) {
            return next(new ErrorResponse("Activity not found", 404));
        }

        const { actuals } = req.body;
        if (!actuals) {
            return next(new ErrorResponse("No actuals data provided", 400));
        }

        await activity.update({ actuals });

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
        next(new ErrorResponse("Error updating activity actuals", 500));
    }
};

/**
 * @desc    Update activity progress (new endpoint)
 * @route   PUT /api/v1/activities/:id/progress
 * @body    { progress: number, remark?, status?, checkedBy?, approvedBy?, action?, summaryReport?, comment?, approvedDate?, dateTime? }
 *
 * Notes:
 * - This endpoint will append an entry to Activity.progressUpdates (via the model hook)
 *   by passing `progressUpdate` and `userId` in the update options.
 * - It will also persist `progress` on the activity record (so both the activity.progress
 *   and the progressUpdates JSONB will be kept in sync).
 */
const updateActivityProgress = async (req: Request, res: Response, next: NextFunction) => {
    const t = await Activity.sequelize?.transaction();
    try {
        const activity = await Activity.findByPk(req.params.id, { transaction: t });
        if (!activity) {
            if (t) await t.rollback();
            return next(new ErrorResponse("Activity not found", 404));
        }

        const {
            progress,
            remark,
            status,
            checkedBy,
            approvedBy,
            action,
            summaryReport,
            comment,
            approvedDate,
            dateTime,
        } = req.body;

        if (typeof progress !== "number") {
            if (t) await t.rollback();
            return next(new ErrorResponse("progress (number) is required", 400));
        }

        // Build the progressUpdate object that the model hook expects
        const progressUpdate: any = {
            id: undefined, // model/hook will generate if missing
            dateTime: dateTime || new Date().toISOString(),
            fromProgress: (activity as any).previous ? (activity as any).previous("progress") : activity.getDataValue("progress"),
            progress,
            remark,
            status,
            checkedBy,
            approvedBy,
            action,
            summaryReport,
            comment,
            approvedDate: approvedDate ?? null,
            userId: (req as any).user?.id || req.body.userId || undefined,
        };

        // Persist progress on the activity and pass the progressUpdate via options so the hook appends it.
        // We also persist checked_by_name when checkedBy provided to keep fields useful for reporting.
        const updatePayload: any = { progress };
        if (checkedBy) updatePayload.checked_by_name = checkedBy;

        await activity.update(updatePayload, {
            transaction: t,
            userId: (req as any).user?.id || req.body.userId || undefined,
            progressUpdate,
        });

        // Commit transaction
        if (t) await t.commit();

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
        if (t) await t.rollback();
        next(new ErrorResponse("Error updating activity progress", 500));
    }
};

export {
    createActivity,
    getAllActivities,
    getActivityById,
    updateActivity,
    deleteActivity,
    updateActivityActuals,
    updateActivityProgress,
};
