import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors"
import config from "./config";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { commnetRoute } from "./modules/comment/comment.routes";
import { postRoute } from "./modules/post/post.routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";


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
app.use("/api/auth", authRoutes);
app.use("/api/comments", commnetRoute);
app.use("/api/posts", postRoute);




app.use(notFound)

app.use(globalErrorHandler)


export default app;