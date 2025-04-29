import express from "express";
import {
    createNotification,
    getAllNotifications,
    getMyNotifications,
    getNotificationById,
    updateNotification,
    deleteNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
} from "../controllers/notification.controller";

const router = express.Router();

router.route("/").post(createNotification).get(getAllNotifications);

// User-specific endpoints
router.route("/my").get(getMyNotifications);
router.route("/unread-count").get(getUnreadCount);
router.route("/read-all").patch(markAllAsRead);
router.route("/:id/read").patch(markAsRead);

// Single notification CRUD
router.route("/:id").get(getNotificationById).put(updateNotification).delete(deleteNotification);

export default router;
