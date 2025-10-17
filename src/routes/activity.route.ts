import express from "express";
import { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity, updateActivityActuals } from "../controllers/activity.controller";

const router = express.Router();

router.route("/").post(createActivity).get(getAllActivities);
router.route("/:id").get(getActivityById).put(updateActivity).delete(deleteActivity);
router.route("/:id/actuals").patch(updateActivityActuals);

export default router;
