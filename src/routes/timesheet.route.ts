import express from "express";
import {
    createLaborEntry,
    getAllLaborEntries,
    getLaborEntryById,
    updateLaborEntry,
    deleteLaborEntry,
    createEquipmentEntry,
    getAllEquipmentEntries,
    getEquipmentEntryById,
    updateEquipmentEntry,
    deleteEquipmentEntry,
    createMaterialEntry,
    getAllMaterialEntries,
    getMaterialEntryById,
    updateMaterialEntry,
    deleteMaterialEntry,
} from "../controllers/timesheet.controller";

const router = express.Router();

// Labor Timesheet Routes
router.route("/labor")
    .post(createLaborEntry)
    .get(getAllLaborEntries);
router.route("/labor/:id")
    .get(getLaborEntryById)
    .put(updateLaborEntry)
    .delete(deleteLaborEntry);

// Equipment Timesheet Routes
router.route("/equipment")
    .post(createEquipmentEntry)
    .get(getAllEquipmentEntries);
router.route("/equipment/:id")
    .get(getEquipmentEntryById)
    .put(updateEquipmentEntry)
    .delete(deleteEquipmentEntry);

// Material Balance Routes
router.route("/material")
    .post(createMaterialEntry)
    .get(getAllMaterialEntries);
router.route("/material/:id")
    .get(getMaterialEntryById)
    .put(updateMaterialEntry)
    .delete(deleteMaterialEntry);

export default router;

