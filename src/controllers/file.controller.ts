import fs from "fs";
import path from "path";
import type { Request, Response } from "express";
import { ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { hasAWS, s3 } from "../middlewares/upload";
import { uploadDir } from "../middlewares/upload";


const normalizeFile = (file: any) => {
    return {
        filename: file.filename || file.key,   // local OR S3
        originalName: file.originalname,
        size: file.size,
        url: file.location || null,            // S3 only
    };
};

export const uploadFile = (
    req: Request,
    res: Response
) => {
    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded"
        });
    }

    res.json({
        success: true,
        file: req.file.filename
    });
};

export const uploadFiles = (req: Request, res: Response) => {
    const files = req.files as any[];

    if (!files || files.length === 0) {
        return res.status(400).json({
            message: "No files uploaded",
        });
    }

    const uploaded = files.map(normalizeFile);

    res.json({
        success: true,
        count: files.length,
        files: uploaded,
    });
};

export const getFiles = async (_req: Request, res: Response) => {
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

        return res.json(files);
    }

    // LOCAL
    const files = fs.readdirSync(uploadDir).map((name) => ({
        filename: name,
        url: `/uploads/${name}`,
    }));

    return res.json(files);
};

export const deleteFile = async (req: Request, res: Response) => {
    const { filename } = req.params;

    if (!filename) {
        return res.json({
            success: false,
            message: "No File Name Provided",
        });
    }

    // S3 MODE
    if (hasAWS && s3) {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: filename as string,
            })
        );

        return res.json({
            success: true,
            message: "Deleted from S3",
        });
    }

    // LOCAL MODE
    const filePath = path.join(uploadDir, filename as string);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "File not found",
        });
    }

    fs.unlinkSync(filePath);

    return res.json({
        success: true,
        message: "Deleted",
    });
};