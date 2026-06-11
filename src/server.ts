import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import viewRoutes from './routes/view.routes';

import fileRoutes from "./routes/file.routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use("/api", fileRoutes);

app.set(
    "views",
    path.join(__dirname, "views")
);

// Serve uploaded files
app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use(viewRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});