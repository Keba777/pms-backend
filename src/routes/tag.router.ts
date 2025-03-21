import express from "express";
import { createTag, getAllTags, getTagById, updateTag, deleteTag } from "../controllers/tag.controller";

const router = express.Router();

router.route("/").post(createTag).get(getAllTags);
router.route("/:id").get(getTagById).put(updateTag).delete(deleteTag);

export default router;
