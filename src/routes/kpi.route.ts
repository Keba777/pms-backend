import express from "express";
import {
    createKPI, getAllKPIs,
    getKPIById, updateKPI, deleteKPI,
    getKPIsByUserLaborId, getKPIsByLaborInfoId,
    getKPIsByEquipmentId
} from "../controllers/kpi.controller";

const router = express.Router();

router.route("/").post(createKPI).get(getAllKPIs);
router.route("/:id").get(getKPIById).put(updateKPI).delete(deleteKPI);
router.route("/labor/:laborInfoId").get(getKPIsByLaborInfoId);
router.route("/user/:userId").get(getKPIsByUserLaborId);
router.route("/equipment/:equipmentId").get(getKPIsByEquipmentId);

export default router;