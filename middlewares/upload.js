import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/HttpError.js";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    cb(null, filename);
  },
});
const limits = { fileSize: 5 * 1024 * 1024 };

const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") {
    return cb(HttpError(400, "Invalid extension"));
  }
  cb(null, true);
};

export const upload = multer({ storage, limits, fileFilter });
