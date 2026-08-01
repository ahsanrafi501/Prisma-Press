import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const getCommentAuthor = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

})
const getComment = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

})
const postComment = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

})
const editCommentByAuthor = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

})
const moderateComment = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

})
const deleteComment = catchAsync(async(req: Request, res: Response, next: NextFunction) =>{

})


export const commentController = {
    getCommentAuthor,
    getComment,
    postComment,
    editCommentByAuthor,
    moderateComment,
    deleteComment


}