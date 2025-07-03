import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import ChatMessage from '../models/ChatMessage.model';
import User from '../models/User.model';
import ErrorResponse from '../utils/error-response.utils';

// ———— Socket‑friendly service functions ————

/**
 * Save a message from → to with content
 */
export const saveMessage = async (
    from: string,
    to: string,
    content: string
): Promise<ChatMessage> => {

    return ChatMessage.create({ fromUserId: from, toUserId: to, content, read: false });
};

/**
 * Fetch the full history between two users, oldest first
 */
export const getMessageHistory = async (
    userA: string,
    userB: string
): Promise<ChatMessage[]> => {
    return ChatMessage.findAll({
        where: {
            fromUserId: [userA, userB],
            toUserId: [userA, userB],
        },
        order: [['createdAt', 'ASC']],
    });
};

/**
 * Mark all unread messages from→to as read
 */
export const markAsRead = async (
    from: string,
    to: string
): Promise<void> => {
    await ChatMessage.update(
        { read: true },
        {
            where: {
                fromUserId: from,
                toUserId: to,
                read: false,
            },
        }
    );
};

// ———— Express HTTP handlers ————

/**
 * GET /api/chat/history/:userA/:userB
 */
export const fetchHistoryHandler = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const { userA, userB } = req.params;
        const data = await getMessageHistory(userA, userB);
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('Error fetching history', 500));
    }
};

/**
 * PUT /api/chat/read
 * body: { from: string; to: string }
 */
export const markReadHandler = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const { from, to } = req.body;
        await markAsRead(from, to);
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('Error marking read', 500));
    }
};

/**
 * GET /api/chat/users
 * returns all users except the authenticated one
 */
export const fetchUsersHandler = async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const authUserId = (req as any).userId; // provided by your JWT middleware
        const users = await User.findAll({
            where: {
                id: { [Op.ne]: authUserId }
            }
        });
        res.status(200).json({ success: true, data: users });
    } catch (err) {
        console.error(err);
        next(new ErrorResponse('Error fetching users', 500));
    }
};
