import express from "express";
import {
    createIssue,
    getAllIssues,
    getIssueById,
    updateIssue,
    deleteIssue,
    getIssuesByRaisedById,
} from "../controllers/issue.controller";

const router = express.Router();

router.route("/").post(createIssue).get(getAllIssues);
router.route("/:id").get(getIssueById).put(updateIssue).delete(deleteIssue);
router.route("/user/:userId").get(getIssuesByRaisedById);

export default router;
