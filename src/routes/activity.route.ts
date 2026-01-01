import express from "express";
import { createActivity, getAllActivities, getActivityById, updateActivity, deleteActivity, updateActivityActuals, updateActivityProgress } from "../controllers/activity.controller";
import { uploadFiles } from "../middlewares/multer";

const router = express.Router();

router.route("/").post(uploadFiles.array("attachments"), createActivity).get(getAllActivities);
router.route("/:id").get(getActivityById).put(uploadFiles.array("attachments"), updateActivity).delete(deleteActivity);
router.route("/:id/actuals").patch(updateActivityActuals);
router.route("/:id/progress").put(updateActivityProgress);

export default router;
