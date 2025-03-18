import multer from "multer";
import path from "path";
import { Request } from "express";

export const filterImage = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req: Request, file: Express.Multer.File, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});