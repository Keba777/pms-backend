// middlewares/multer.ts
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

export const filterImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(new Error("Only .jpg/.jpeg/.png images are allowed"));
    }
    cb(null, true);
  },
});
