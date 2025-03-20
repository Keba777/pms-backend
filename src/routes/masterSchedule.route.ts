import express from "express";
import {
    createMasterSchedule,
    getAllMasterSchedules,
    getMasterScheduleById,
    updateMasterSchedule,
    deleteMasterSchedule
} from "../controllers/masterSchedule.controller";

const router = express.Router();

router.route("/").post(createMasterSchedule).get(getAllMasterSchedules);
router.route("/:id").get(getMasterScheduleById).put(updateMasterSchedule).delete(deleteMasterSchedule);

export default router;
