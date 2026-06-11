import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';
import fs from 'fs';
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from 'multer-s3';

export let uploadDir = path.join(__dirname, "../uploads");

export const hasAWS =
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_BUCKET_NAME && process.env.AWS_REGION;

export let s3: S3Client | null = null;

if (hasAWS) {
    s3 = new S3Client({
        region: process.env.AWS_REGION!,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });
}

const localStorage = multer.diskStorage(
    {
        destination(_req, _file, callback) {
            const dir = "src/uploads";

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            callback(null, dir)
        },
        filename(_req, file, callback) {
            const extension = path.extname(file.originalname);

            callback(null, `${uuid()}${extension}`);
        }
    }
);

const s3Storage = s3 && multerS3(
    {
        s3,
        bucket: process.env.AWS_BUCKET_NAME!,
        key: (_req, file, callback) => {
            const extension = path.extname(file.originalname);
            callback(null, `${uuid()}${extension}`);
        }
    }
)
const storage = hasAWS && s3Storage ? s3Storage : localStorage;

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});