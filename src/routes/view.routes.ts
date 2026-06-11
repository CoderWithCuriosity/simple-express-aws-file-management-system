import { Router } from "express";
import type { Request, Response } from "express";
import fs from 'fs';
import path from "path";

const router = Router();

router.get(
  "/",
  (_req: Request, res: Response) => {
    res.render("index");
  }
);

router.get(
  "/files",
  (_req: Request, res: Response) => {
    const uploadDir = path.join(__dirname, "../uploads");

    const files = fs.readdirSync(uploadDir);
    res.render("files", {
      files
    });
  }
);


export default router;