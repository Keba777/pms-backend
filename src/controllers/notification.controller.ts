import { NextFunction, Request, Response } from "express";
import Notification from "../models/Notification.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";

// @desc    Create a new notification
// @route   POST /api/v1/notifications
const createNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, type, data } = req.body;

        // Ensure user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return next(new ErrorResponse("User not found", 404));
        }

        const notification = await Notification.create({ user_id, type, data });
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating notification", 500));
    }
};

// @desc    Get all notifications (admin)
// @route   GET /api/v1/notifications
const getAllNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notifications = await Notification.findAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
            order: [["createdAt", "ASC"]],
        });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving notifications", 500));
    }
};

// @desc    Get notifications for the logged-in user
// @route   GET /api/v1/notifications/my
const getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const notifications = await Notification.findAll({
            where: { user_id: userId },
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving user notifications", 500));
    }
};

// @desc    Get a notification by ID
// @route   GET /api/v1/notifications/:id
const getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "first_name", "last_name", "email"],
                },
            ],
        });

        if (!notification) {
            return next(new ErrorResponse("Notification not found", 404));
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error retrieving notification", 500));
    }
};

// @desc    Update a notification (e.g., mark as read)
// @route   PUT /api/v1/notifications/:id
const updateNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return next(new ErrorResponse("Notification not found", 404));
        }

        await notification.update(req.body);
        const updated = await Notification.findByPk(notification.id);

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating notification", 500));
    }
};

// @desc    Delete a notification
// @route   DELETE /api/v1/notifications/:id
const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return next(new ErrorResponse("Notification not found", 404));
        }

        await notification.destroy();
        res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting notification", 500));
    }
};

// @desc    Mark a single notification as read
// @route   PATCH /api/v1/notifications/:id/read
const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notification = await Notification.findByPk(req.params.id);
        if (!notification) {
            return next(new ErrorResponse("Notification not found", 404));
        }
        await notification.update({ read: true });
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error marking notification as read", 500));
    }
};

// @desc    Mark all notifications as read for the logged-in user
// @route   PATCH /api/v1/notifications/read-all
const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        await Notification.update(
            { read: true },
            { where: { user_id: userId, read: false } }
        );
        res.status(200).json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error marking all notifications as read", 500));
    }
};

// @desc    Get unread notifications count for the logged-in user
// @route   GET /api/v1/notifications/unread-count
const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const count = await Notification.count({
            where: { user_id: userId, read: false },
        });
        res.status(200).json({ success: true, data: { count } });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error getting unread count", 500));
    }
};

export {
    createNotification,
    getAllNotifications,
    getMyNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
};
