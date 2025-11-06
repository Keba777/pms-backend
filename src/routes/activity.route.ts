import express from "express";
import { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity, updateActivityActuals, updateActivityProgress } from "../controllers/activity.controller";

const router = express.Router();

router.route("/").post(createActivity).get(getAllActivities);
router.route("/:id").get(getActivityById).put(updateActivity).delete(deleteActivity);
router.route("/:id/actuals").patch(updateActivityActuals);
router.route("/:id/progress").put(updateActivityProgress);

export default router;
