import express from "express";
import { createEquipment, getAllEquipments, getEquipmentById, updateEquipment, deleteEquipment } from "../controllers/equipment.controller";

const router = express.Router();

router.route("/").post(createEquipment).get(getAllEquipments);
router.route("/:id").get(getEquipmentById).put(updateEquipment).delete(deleteEquipment);

export default router;
