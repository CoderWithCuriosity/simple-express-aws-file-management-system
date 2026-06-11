import { Router } from "express";

import {
  uploadFile,
  getFiles,
  deleteFile,
  uploadFiles
} from "../controllers/file.controller";

import { upload } from "../middlewares/upload";

const router = Router();

router.post(
  "/upload",
  upload.single("file"),
  uploadFile
);

router.post(
  "/uploads",
  upload.array("files", 10),
  uploadFiles
);

router.get(
  "/files",
  getFiles
);

router.post(
  "/delete/:filename",
  deleteFile
);

export default router;