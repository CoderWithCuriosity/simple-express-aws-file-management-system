import { Router } from "express";
import type { Request, Response } from "express";
import fs from 'fs';
import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { hasAWS, s3 } from "../middlewares/upload";
import { uploadDir } from "../middlewares/upload";

const router = Router();

router.get(
  "/",
  (_req: Request, res: Response) => {
    return res.render("index");
  }
);

router.get(
  "/files",
  async (_req: Request, res: Response) => {
    if (hasAWS && s3) {
      const result = await s3.send(
        new ListObjectsV2Command({
          Bucket: process.env.AWS_BUCKET_NAME!,
        })
      );

      const files =
        result.Contents?.map((item) => ({
          filename: item.Key,
          size: item.Size,
          url: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${item.Key}`,
        })) || [];

      return res.render("files", {
        files
      });
    }

    // LOCAL
    const files = fs.readdirSync(uploadDir).map((name) => ({
      filename: name,
      url: `/uploads/${name}`,
    }));
    return res.render("files", {
      files
    });
  }
);


export default router;