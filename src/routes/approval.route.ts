import express from "express"
import { createApproval, getAllApprovals, getApprovalById, updateApproval, deleteApproval, getApprovalsByRequestId } from "../controllers/approval.controller";

const router = express.Router();

router.route("/").post(createApproval).get(getAllApprovals);
router.route("/:id").get(getApprovalById).put(updateApproval).delete(deleteApproval);
router.route("/:requestId").get(getApprovalsByRequestId);

export default router;