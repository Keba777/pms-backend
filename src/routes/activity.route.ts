import express from "express";
import { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity } from "../controllers/activity.controller";

const router = express.Router();

router.route("/").post(createActivity).get(getAllActivities);
router.route("/:id").get(getActivityById).put(updateActivity).delete(deleteActivity);

export default router;
