import express from "express";
import {
    createBudget,
    getAllBudgets,
    getBudgetById,
    updateBudget,
    deleteBudget,
} from "../controllers/budget.controller";

const router = express.Router();

router.route("/").post(createBudget).get(getAllBudgets);
router.route("/:id").get(getBudgetById).put(updateBudget).delete(deleteBudget);

export default router;
