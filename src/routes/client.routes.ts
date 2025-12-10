import { Router } from "express";
import {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
} from "../controllers/client.controller";

const router = Router();

router
    .route("/")
    .post(createClient)
    .get(getAllClients);

router
    .route("/:id")
    .get(getClientById)
    .put(updateClient)
    .delete(deleteClient);

export default router;
