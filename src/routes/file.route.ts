import Router from "express";
import { uploadFile, getAllFiles, getFileById, updateFile, deleteFile } from "../controllers/file.controller";
import { uploadFiles } from "../middlewares/multer";

const router = Router();

router.route("/").post(uploadFiles.array("files"), uploadFile).get(getAllFiles);
router.route("/:id").get(getFileById).put(updateFile).delete(deleteFile);

export default router;