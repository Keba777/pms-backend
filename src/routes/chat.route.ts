import express from "express";
import multer from "multer";
import {
  getUserChatRooms,
  createIndividualChatRoom,
  createGroupChatRoom,
  getChatRoomById,
  updateGroupChatRoom,
  deleteGroupChatRoom,
  addMembersToGroup,
  removeMemberFromGroup,
  sendChatMessage,
  getChatMessages,
  deleteChatMessage,
} from "../controllers/chat.controller";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); 

// Chat Rooms Routes
router.route("/chat_rooms").get(getUserChatRooms);

router.route("/chat_rooms/individual").post(createIndividualChatRoom);

router.route("/chat_rooms/group").post(createGroupChatRoom);

router
  .route("/chat_rooms/:id")
  .get(getChatRoomById)
  .put(updateGroupChatRoom)
  .delete(deleteGroupChatRoom);

router.route("/chat_rooms/:id/members").post(addMembersToGroup);

router.route("/chat_rooms/:id/members/:userId").delete(removeMemberFromGroup);

// Chat Messages Routes
router
  .route("/chat_messages")
  .post(upload.single("file"), sendChatMessage)
  .get(getChatMessages);

router.route("/chat_messages/:id").delete(deleteChatMessage);

export default router;
