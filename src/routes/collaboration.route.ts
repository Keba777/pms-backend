import Router from "express";
import {
  createDiscussion,
  getAllDiscussions,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
} from "../controllers/collaboration.controller";

const router = Router();

/*
  Discussions
*/
router.route("/discussions").post(createDiscussion).get(getAllDiscussions);
router.route("/discussions/:id").get(getDiscussionById).put(updateDiscussion).delete(deleteDiscussion);

/*
  Notifications
*/
router.route("/notifications").post(createNotification).get(getAllNotifications);
router.route("/notifications/:id").get(getNotificationById).put(updateNotification).delete(deleteNotification);

/*
  Activities
*/
router.route("/activity-logs").post(createActivity).get(getAllActivities);
router.route("/activity-logs/:id").get(getActivityById).put(updateActivity).delete(deleteActivity);

export default router;
