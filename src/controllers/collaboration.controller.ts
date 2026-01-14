import { Request, Response, NextFunction } from "express";
import { Discussion, CollaborationNotification, ActivityLog } from "../models/Collaboration.model";
import User from "../models/User.model";
import ErrorResponse from "../utils/error-response.utils";
import { ReqWithUser } from "../types/req-with-user";

/* ====================
   Discussions controllers
   ==================== */

// @desc Create a new discussion
// @route POST /api/v1/discussions
export const createDiscussion = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const { subject, body, type, referenceId, isPrivate, participants } = req.body;
    if (!subject || !body || !type || !referenceId) {
      return next(new ErrorResponse("subject, body, type and referenceId are required", 400));
    }

    // Casting to any here prevents TS 'Model.create' signature issues; the runtime expects a plain object.
    const discussion = await Discussion.create({
      subject,
      body,
      type,
      referenceId,
      createdBy: req.user!.id,
      isPrivate: isPrivate ?? false,
      participants: participants ?? null,
      date: new Date(),
    } as any);

    const populated = await Discussion.findByPk(discussion.id, {
      include: [{ model: User, as: "createdByUser", attributes: { exclude: ["password"] } }],
    });

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error creating discussion", 500));
  }
};

// @desc Get all discussions
// @route GET /api/v1/discussions
export const getAllDiscussions = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const discussions = await Discussion.findAll({
      include: [{ model: User, as: "createdByUser", attributes: { exclude: ["password"] } }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: discussions });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error fetching discussions", 500));
  }
};

// @desc Get single discussion by ID
// @route GET /api/v1/discussions/:id
export const getDiscussionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id as string, {
      include: [{ model: User, as: "createdByUser", attributes: { exclude: ["password"] } }],
    });
    if (!discussion) return next(new ErrorResponse("Discussion not found", 404));
    res.status(200).json({ success: true, data: discussion });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error fetching discussion", 500));
  }
};

// @desc Update a discussion's fields
// @route PUT /api/v1/discussions/:id
export const updateDiscussion = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id as string);
    if (!discussion) return next(new ErrorResponse("Discussion not found", 404));
    const { subject, body, isPrivate, participants, lastMessageAt, pinned } = req.body;
    await discussion.update({
      subject: subject ?? discussion.subject,
      body: body ?? discussion.body,
      isPrivate: isPrivate ?? discussion.isPrivate,
      participants: participants ?? discussion.participants,
      lastMessageAt: lastMessageAt ?? discussion.lastMessageAt,
      pinned: pinned ?? discussion.pinned,
    } as any);

    const updated = await Discussion.findByPk(discussion.id, {
      include: [{ model: User, as: "createdByUser", attributes: { exclude: ["password"] } }],
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error updating discussion", 500));
  }
};

// @desc Delete a discussion
// @route DELETE /api/v1/discussions/:id
export const deleteDiscussion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const discussion = await Discussion.findByPk(req.params.id as string);
    if (!discussion) return next(new ErrorResponse("Discussion not found", 404));
    await discussion.destroy();
    res.status(200).json({ success: true, message: "Discussion deleted successfully" });
  } catch (error) {
    console.error(error);
    next(new ErrorResponse("Error deleting discussion", 500));
  }
};

/* ====================
   Notifications controllers
   ==================== */

// @desc Create a new notification
// @route POST /api/v1/notifications
export const createNotification = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const { title, message, recipient, sender, type, referenceId, meta } = req.body;
    if (!message || !recipient || !type || !referenceId) {
      return next(new ErrorResponse("message, recipient, type and referenceId are required", 400));
    }

    const notification = await CollaborationNotification.create({
      title,
      message,
      recipient,
      sender: sender ?? req.user?.id ?? null,
      type,
      referenceId,
      meta: meta ?? null,
      date: new Date(),
      read: false,
    } as any);

    const populated = await CollaborationNotification.findByPk(notification.id, {
      include: [
        { model: User, as: "recipientUser", attributes: { exclude: ["password"] } },
        { model: User, as: "senderUser", attributes: { exclude: ["password"] } },
      ],
    });

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error creating notification", 500));
  }
};

// @desc Get all notifications
// @route GET /api/v1/notifications
export const getAllNotifications = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await CollaborationNotification.findAll({
      include: [
        { model: User, as: "recipientUser", attributes: { exclude: ["password"] } },
        { model: User, as: "senderUser", attributes: { exclude: ["password"] } },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error fetching notifications", 500));
  }
};

// @desc Get single notification by ID
// @route GET /api/v1/notifications/:id
export const getNotificationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await CollaborationNotification.findByPk(req.params.id as string, {
      include: [
        { model: User, as: "recipientUser", attributes: { exclude: ["password"] } },
        { model: User, as: "senderUser", attributes: { exclude: ["password"] } },
      ],
    });
    if (!notification) return next(new ErrorResponse("Notification not found", 404));
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error fetching notification", 500));
  }
};

// @desc Update a notification
// @route PUT /api/v1/notifications/:id
export const updateNotification = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const notification = await CollaborationNotification.findByPk(req.params.id as string);
    if (!notification) return next(new ErrorResponse("Notification not found", 404));
    const { title, message, read, meta } = req.body;
    await notification.update({
      title: title ?? notification.title,
      message: message ?? notification.message,
      read: read ?? notification.read,
      meta: meta ?? notification.meta,
    } as any);

    const updated = await CollaborationNotification.findByPk(notification.id, {
      include: [
        { model: User, as: "recipientUser", attributes: { exclude: ["password"] } },
        { model: User, as: "senderUser", attributes: { exclude: ["password"] } },
      ],
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error updating notification", 500));
  }
};

// @desc Delete a notification
// @route DELETE /api/v1/notifications/:id
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notification = await CollaborationNotification.findByPk(req.params.id as string);
    if (!notification) return next(new ErrorResponse("Notification not found", 404));
    await notification.destroy();
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error deleting notification", 500));
  }
};

/* ====================
   Activity controllers
   ==================== */

// @desc Create a new activity log
// @route POST /api/v1/activities
export const createActivity = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    let { action, actor, type, referenceId, details, parentActivityId } = req.body;
    if (!action || !type || !referenceId) {
      return next(new ErrorResponse("action, type and referenceId are required", 400));
    }

    if (actor === '') actor = null;
    parentActivityId = parentActivityId ? Number(parentActivityId) : null;
    if (parentActivityId !== null && isNaN(parentActivityId)) {
      return next(new ErrorResponse("Invalid parentActivityId", 400));
    }

    const activity = await ActivityLog.create({
      action,
      actor: actor ?? req.user?.id ?? null,
      type,
      referenceId,
      details: details ?? null,
      parentActivityId,
      date: new Date(),
    } as any);

    const populated = await ActivityLog.findByPk(activity.id, {
      include: [{ model: User, as: "actorUser", attributes: { exclude: ["password"] } }],
    });

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error creating activity", 500));
  }
};

// @desc Get all activity logs
// @route GET /api/v1/activities
export const getAllActivities = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const activities = await ActivityLog.findAll({
      include: [{ model: User, as: "actorUser", attributes: { exclude: ["password"] } }],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, data: activities });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error fetching activities", 500));
  }
};

// @desc Get single activity log by ID
// @route GET /api/v1/activities/:id
export const getActivityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await ActivityLog.findByPk(req.params.id as string, {
      include: [{ model: User, as: "actorUser", attributes: { exclude: ["password"] } }],
    });
    if (!activity) return next(new ErrorResponse("Activity not found", 404));
    res.status(200).json({ success: true, data: activity });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error fetching activity", 500));
  }
};

// @desc Update an activity log
// @route PUT /api/v1/activities/:id
export const updateActivity = async (req: ReqWithUser, res: Response, next: NextFunction) => {
  try {
    const activity = await ActivityLog.findByPk(req.params.id as string);
    if (!activity) return next(new ErrorResponse("Activity not found", 404));
    let { action, details, parentActivityId } = req.body;

    parentActivityId = parentActivityId ? Number(parentActivityId) : activity.parentActivityId;
    if (parentActivityId !== null && isNaN(parentActivityId)) {
      return next(new ErrorResponse("Invalid parentActivityId", 400));
    }

    await activity.update({
      action: action ?? activity.action,
      details: details ?? activity.details,
      parentActivityId,
    } as any);

    const updated = await ActivityLog.findByPk(activity.id, {
      include: [{ model: User, as: "actorUser", attributes: { exclude: ["password"] } }],
    });

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error updating activity", 500));
  }
};

// @desc Delete an activity log
// @route DELETE /api/v1/activities/:id
export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activity = await ActivityLog.findByPk(req.params.id as string);
    if (!activity) return next(new ErrorResponse("Activity not found", 404));
    await activity.destroy();
    res.status(200).json({ success: true, message: "Activity deleted successfully" });
  } catch (err) {
    console.error(err);
    next(new ErrorResponse("Error deleting activity", 500));
  }
};