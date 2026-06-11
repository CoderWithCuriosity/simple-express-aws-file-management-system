import fs from "fs";
import path from "path";
import type { Request, Response } from "express";

const uploadDir = path.join(__dirname, "../uploads");

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

export const uploadFiles = (
    req: Request,
    res: Response
) => {
    const files = req.files as Express.Multer.File[]
    if (!files || files.length === 0) {
        return res.status(400).json({
            message: "No files uploaded"
        });
    }

    const uploaded = files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        size: file.size
    }));

    res.json({
        success: true,
        count: files.length,
        files: uploaded
    });
};

export const getFiles = (
    _req: Request,
    res: Response
) => {
    const files = fs.readdirSync(uploadDir);

    res.json(files);
};

export const deleteFile = (
    req: Request,
    res: Response
) => {
    const { filename } = req.params;

    if (filename == undefined || filename == "") {
        res.json({
            success: false,
            message: 'No File Name Provided'
        })
    }

    const filePath = path.join(uploadDir, filename as string);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            message: "File not found"
        });
    }

    fs.unlinkSync(filePath);

    res.json({
        success: true,
        message: "Deleted"
    });
};