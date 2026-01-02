import { Router } from "express";
import {
    getAllOrganizations,
    getOrganizationById,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    createSuperAdmin
} from "../controllers/organization.controller";
import protectRoute from "../middlewares/auth";
import { authorize } from "../middlewares/authorize.middleware";
import { uploadFiles } from "../middlewares/multer";

const router = Router();

router.use(protectRoute);

router.route("/")
    .get(authorize("manage", "organizations"), getAllOrganizations)
    .post(
        uploadFiles.fields([
            { name: "logo", maxCount: 1 },
            { name: "favicon", maxCount: 1 }
        ]),
        authorize("manage", "organizations"),
        createOrganization
    );

router.route("/:id")
    .get(getOrganizationById)
    .put(
        uploadFiles.fields([
            { name: "logo", maxCount: 1 },
            { name: "favicon", maxCount: 1 }
        ]),
        updateOrganization
    )
    .delete(authorize("manage", "organizations"), deleteOrganization);

router.route("/:id/create-superadmin")
    .post(authorize("manage", "organizations"), createSuperAdmin);

export default router;
