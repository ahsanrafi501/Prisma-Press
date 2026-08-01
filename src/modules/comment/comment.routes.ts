import { Router } from "express";
import { commentController } from "./comment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

router.get("/author/:authorId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.getComment);

router.get("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.getCommentAuthor);

router.post("/", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.postComment);

router.patch("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.editCommentByAuthor);

router.delete("/:commentId", auth(Role.USER, Role.ADMIN, Role.AUTHOR), commentController.deleteComment);

router.patch("/:commentId/moderate", auth(Role.ADMIN), commentController.moderateComment);

export const commnetRoute = router;