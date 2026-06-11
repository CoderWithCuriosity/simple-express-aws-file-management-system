import multer from 'multer';
import { v4 as uuid } from 'uuid';
import path from 'path';

const storage = multer.diskStorage(
    {
        destination(_req, _file, callback) {
            callback(null, "src/uploads")
        },
        filename(_req, file, callback) {
            const extension = path.extname(file.originalname);

            callback(null, `${uuid()}${extension}`);
        }
    }
);

export const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});