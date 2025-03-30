import express from "express";
import { createMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial } from "../controllers/material.controller";

const router = express.Router();

router.route("/").post(createMaterial).get(getAllMaterials);
router.route("/:id").get(getMaterialById).put(updateMaterial).delete(deleteMaterial);

export default router;
