import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/role.controller";

const router = express.Router();

router.route("/").post(createRole).get(getAllRoles);
router.route("/:id").get(getRoleById).put(updateRole).delete(deleteRole);

export default router;