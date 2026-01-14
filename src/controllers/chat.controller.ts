import { Request, Response, NextFunction } from "express";
import { ReqWithUser } from "../types/req-with-user";
import ErrorResponse from "../utils/error-response.utils";
import cloudinary from "../config/cloudinary";
import fs from "fs";
import { Op } from "sequelize";
import User from "../models/User.model";
import { ChatMessage, ChatRoom, ChatRoomMember } from "../models/Chat.model";

// @desc    Get all chat rooms for the current user
// @route   GET /api/v1/chat_rooms
export const getUserChatRooms = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        // First, get all room IDs where the user is a member
        const memberRooms = await ChatRoomMember.findAll({
            where: { user_id: req.user.id },
            attributes: ['room_id'],
        });
        const roomIds = memberRooms.map(m => m.room_id);

        // Then, fetch the rooms with all members
        const rooms = await ChatRoom.findAll({
            where: { id: { [Op.in]: roomIds } },
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: ChatMessage,
                    as: "messages",
                    limit: 1,
                    order: [["createdAt", "DESC"]],
                    required: false,
                    attributes: ["id", "content", "type", "filename", "createdAt"],
                },
                {
                    model: User,
                    as: "owner",
                    attributes: { exclude: ["password"] },
                    required: false,
                },
            ],
            order: [["updatedAt", "DESC"]],
        });

        res.status(200).json({ success: true, data: rooms });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching chat rooms", 500));
    }
};

// @desc    Create an individual chat room between two users
// @route   POST /api/v1/chat_rooms/individual
export const createIndividualChatRoom = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const { otherUserId } = req.body;
        if (!otherUserId) {
            return next(new ErrorResponse("otherUserId is required", 400));
        }

        const otherUser = await User.findByPk(otherUserId);
        if (!otherUser) {
            return next(new ErrorResponse("Other user not found", 404));
        }

        // Check if room already exists between these two users
        const existingRoom = await ChatRoom.findOne({
            where: { is_group: false },
            include: [
                {
                    model: User,
                    as: "members",
                    where: { id: { [Op.in]: [req.user.id, otherUserId] } },
                    through: { attributes: [] },
                },
            ],
        });

        if (existingRoom) {
            const populatedRoom = await ChatRoom.findByPk(existingRoom.id, {
                include: [
                    {
                        model: User,
                        as: "members",
                        through: { attributes: [] },
                        attributes: { exclude: ["password"] },
                    },
                    {
                        model: ChatMessage,
                        as: "messages",
                        order: [["createdAt", "ASC"]],
                    },
                ],
            });
            return res.status(200).json({ success: true, data: populatedRoom });
        }

        // Create new room
        const room = await ChatRoom.create({
            is_group: false,
        });

        // Add members
        await ChatRoomMember.bulkCreate([
            { room_id: room.id, user_id: req.user.id },
            { room_id: room.id, user_id: otherUserId },
        ]);

        const populatedRoom = await ChatRoom.findByPk(room.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: ChatMessage,
                    as: "messages",
                    order: [["createdAt", "ASC"]],
                },
            ],
        });

        res.status(201).json({ success: true, data: populatedRoom });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating individual chat room", 500));
    }
};

// @desc    Create a group chat room
// @route   POST /api/v1/chat_rooms/group
export const createGroupChatRoom = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const { name, memberIds } = req.body;
        if (!name || !Array.isArray(memberIds) || memberIds.length === 0) {
            return next(new ErrorResponse("name and memberIds (array) are required", 400));
        }

        // Validate members exist (excluding self)
        const members = await User.findAll({
            where: { id: { [Op.in]: memberIds } },
        });
        if (members.length !== memberIds.length) {
            return next(new ErrorResponse("Some members not found", 404));
        }

        // Create room
        const room = await ChatRoom.create({
            name,
            is_group: true,
            owner_id: req.user.id,
        });

        // Add members including owner
        const allMemberIds = [...new Set([...memberIds, req.user.id])];
        await ChatRoomMember.bulkCreate(
            allMemberIds.map((user_id) => ({ room_id: room.id, user_id }))
        );

        const populatedRoom = await ChatRoom.findByPk(room.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: User,
                    as: "owner",
                    attributes: { exclude: ["password"] },
                },
                {
                    model: ChatMessage,
                    as: "messages",
                    order: [["createdAt", "ASC"]],
                },
            ],
        });

        res.status(201).json({ success: true, data: populatedRoom });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error creating group chat room", 500));
    }
};

// @desc    Get a chat room by ID
// @route   GET /api/v1/chat_rooms/:id
export const getChatRoomById = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const room = await ChatRoom.findByPk(req.params.id as string, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: User,
                    as: "owner",
                    attributes: { exclude: ["password"] },
                    required: false,
                },
                {
                    model: ChatMessage,
                    as: "messages",
                    include: [
                        {
                            model: User,
                            as: "sender",
                            attributes: { exclude: ["password"] },
                        },
                    ],
                    order: [["createdAt", "ASC"]],
                },
            ],
        });

        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        // Check if user is a member
        const isMember = room.members?.some((m) => m.id === req.user.id);
        if (!isMember) {
            return next(new ErrorResponse("Not authorized to access this room", 403));
        }

        res.status(200).json({ success: true, data: room });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching chat room", 500));
    }
};

// @desc    Update a group chat room (name only, for owners)
// @route   PUT /api/v1/chat_rooms/:id
export const updateGroupChatRoom = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const room = await ChatRoom.findByPk(req.params.id as string);
        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        if (!room.is_group || room.owner_id !== req.user.id) {
            return next(new ErrorResponse("Not authorized to update this room", 403));
        }

        const { name } = req.body;
        if (!name) {
            return next(new ErrorResponse("name is required", 400));
        }

        await room.update({ name });

        const updatedRoom = await ChatRoom.findByPk(room.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
                {
                    model: User,
                    as: "owner",
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error updating group chat room", 500));
    }
};

// @desc    Delete a group chat room (owner only)
// @route   DELETE /api/v1/chat_rooms/:id
export const deleteGroupChatRoom = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const room = await ChatRoom.findByPk(req.params.id as string);
        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        if (!room.is_group || room.owner_id !== req.user.id) {
            return next(new ErrorResponse("Not authorized to delete this room", 403));
        }

        // Delete messages
        await ChatMessage.destroy({ where: { room_id: room.id } });

        // Delete members
        await ChatRoomMember.destroy({ where: { room_id: room.id } });

        // Delete room
        await room.destroy();

        res.status(200).json({ success: true, message: "Group chat room deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting group chat room", 500));
    }
};

// @desc    Add members to a group chat room (owner only)
// @route   POST /api/v1/chat_rooms/:id/members
export const addMembersToGroup = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const room = await ChatRoom.findByPk(req.params.id as string);
        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        if (!room.is_group || room.owner_id !== req.user.id) {
            return next(new ErrorResponse("Not authorized to add members", 403));
        }

        const { memberIds } = req.body;
        if (!Array.isArray(memberIds) || memberIds.length === 0) {
            return next(new ErrorResponse("memberIds (array) is required", 400));
        }

        // Validate new members exist
        const newMembers = await User.findAll({
            where: { id: { [Op.in]: memberIds } },
        });
        if (newMembers.length !== memberIds.length) {
            return next(new ErrorResponse("Some members not found", 404));
        }

        // Check existing members
        const existingMembers = await ChatRoomMember.findAll({
            where: { room_id: room.id, user_id: { [Op.in]: memberIds } },
        });
        const existingIds = existingMembers.map((m) => m.user_id);

        // Add only new ones
        const toAdd = memberIds.filter((id) => !existingIds.includes(id));
        if (toAdd.length > 0) {
            await ChatRoomMember.bulkCreate(
                toAdd.map((user_id) => ({ room_id: room.id, user_id }))
            );
        }

        const updatedRoom = await ChatRoom.findByPk(room.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error adding members", 500));
    }
};

// @desc    Remove a member from a group chat room (owner only, cannot remove self)
// @route   DELETE /api/v1/chat_rooms/:id/members/:userId
export const removeMemberFromGroup = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const room = await ChatRoom.findByPk(req.params.id as string);
        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        if (!room.is_group || room.owner_id !== req.user.id) {
            return next(new ErrorResponse("Not authorized to remove members", 403));
        }

        const userId = req.params.userId as string;
        if (userId === req.user.id) {
            return next(new ErrorResponse("Cannot remove yourself as owner", 400));
        }

        const member = await ChatRoomMember.findOne({
            where: { room_id: room.id, user_id: userId },
        });
        if (!member) {
            return next(new ErrorResponse("Member not found in room", 404));
        }

        await member.destroy();

        const updatedRoom = await ChatRoom.findByPk(room.id, {
            include: [
                {
                    model: User,
                    as: "members",
                    through: { attributes: [] },
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        res.status(200).json({ success: true, data: updatedRoom });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error removing member", 500));
    }
};

// @desc    Send a message to a chat room (text, voice, or file)
// @route   POST /api/v1/chat_messages
// Note: For voice/file, use multer for req.file
export const sendChatMessage = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const { room_id, type, content } = req.body;
        if (!room_id || !type) {
            return next(new ErrorResponse("room_id and type are required", 400));
        }

        if (!["text", "voice", "file"].includes(type)) {
            return next(new ErrorResponse("Invalid message type", 400));
        }

        const room = await ChatRoom.findByPk(room_id, {
            include: [{ model: User, as: "members" }],
        });
        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        // Check if user is a member
        const isMember = room.members?.some((m) => m.id === req.user.id);
        if (!isMember) {
            return next(new ErrorResponse("Not authorized to send message in this room", 403));
        }

        let media_url: string | undefined;
        let filename: string | undefined;
        let mime_type: string | undefined;

        if (type !== "text") {
            if (!req.file) {
                return next(new ErrorResponse("File required for voice or file type", 400));
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "chat_media",
                resource_type: type === "voice" ? "video" : "auto", // Voice as video for audio
            });

            fs.unlinkSync(req.file.path);

            media_url = result.secure_url;
            filename = req.file.originalname;
            mime_type = req.file.mimetype;
        } else {
            if (!content) {
                return next(new ErrorResponse("content required for text type", 400));
            }
        }

        const message = await ChatMessage.create({
            room_id,
            sender_id: req.user.id,
            type,
            content: type === "text" ? content : undefined,
            media_url,
            filename,
            mime_type,
        });

        const populatedMessage = await ChatMessage.findByPk(message.id, {
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: { exclude: ["password"] },
                },
            ],
        });

        // Update room timestamp
        await room.update({ updatedAt: new Date() });

        res.status(201).json({ success: true, data: populatedMessage });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error sending message", 500));
    }
};

// @desc    Get messages for a chat room
// @route   GET /api/v1/chat_messages?room_id=:roomId
export const getChatMessages = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const { room_id } = req.query;
        if (!room_id) {
            return next(new ErrorResponse("room_id is required", 400));
        }

        const room = await ChatRoom.findByPk(room_id as string, {
            include: [{ model: User, as: "members" }],
        });
        if (!room) {
            return next(new ErrorResponse("Chat room not found", 404));
        }

        // Check if user is a member
        const isMember = room.members?.some((m) => m.id === req.user.id);
        if (!isMember) {
            return next(new ErrorResponse("Not authorized to access messages", 403));
        }

        const messages = await ChatMessage.findAll({
            where: { room_id: room_id as string },
            include: [
                {
                    model: User,
                    as: "sender",
                    attributes: { exclude: ["password"] },
                },
            ],
            order: [["createdAt", "ASC"]],
        });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error fetching messages", 500));
    }
};

// @desc    Delete a chat message
// @route   DELETE /api/v1/chat_messages/:id
export const deleteChatMessage = async (req: ReqWithUser, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new ErrorResponse("User not authenticated", 401));
        }

        const message = await ChatMessage.findByPk(req.params.id as string);
        if (!message) {
            return next(new ErrorResponse("Message not found", 404));
        }

        if (message.sender_id !== req.user.id) {
            return next(new ErrorResponse("Not authorized to delete this message", 403));
        }

        // If media, delete from Cloudinary
        if (message.media_url) {
            const publicId = message.media_url.split("/").pop()?.split(".")[0];
            if (publicId) {
                await cloudinary.uploader.destroy(`chat_media/${publicId}`);
            }
        }

        await message.destroy();

        res.status(200).json({ success: true, message: "Message deleted successfully" });
    } catch (error) {
        console.error(error);
        next(new ErrorResponse("Error deleting message", 500));
    }
};
