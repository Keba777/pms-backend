import express from "express";
import { createKPI, getAllKPIs, getKPIById, updateKPI, deleteKPI } from "../controllers/kpi.controller";

const router = express.Router();

router.route("/").post(createKPI).get(getAllKPIs);
router.route("/:id").get(getKPIById).put(updateKPI).delete(deleteKPI);

export default router;