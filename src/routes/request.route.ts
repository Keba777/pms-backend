import express from "express";
import { createRequest, getAllRequests, getRequestById, updateRequest, deleteRequest, getRequestsByUserId } from "../controllers/request.controller";

const router = express.Router();

router.route("/").post(createRequest).get(getAllRequests)
router.route("/:id").get(getRequestById).put(updateRequest).delete(deleteRequest)
router.route("/:userId").get(getRequestsByUserId)

export default router;