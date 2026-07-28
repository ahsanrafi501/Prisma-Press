import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { prisma } from "./lib/prisma";
import httpstatus from "http-status";
import bcrypt from "bcryptjs";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
    res.send("hello World")
})

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes)


export default app;