import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { postService } from "./post.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status"


const createPost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const payload = req.body;
    const result = await postService.createPostIntoDB(payload, id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.CREATED,
        message: "Post created successfully",
        data: {
            result
        }
    })
})

const getAllPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    // console.log(query);
    const result = await postService.getAllPostsFromDB(query);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "All post retrieved successfully",
        data: {
            result
        }
    })
})
const getPostById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const postId = req.params.postId;

    if (!postId) {
        throw new Error("Post id required in params")
    }
    const post = await postService.getPostByIdFromDB(postId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Post retrived successfully",
        data: {
            post
        }
    })
})



const getMyPosts = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const myPosts = await postService.getMyPostsFromDB(userId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "My posts retrived successfully",
        data: {
            myPosts
        }
    })
})



const updatePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.Role === "ADMIN";
    const postId = req.params.postId;
    const payload = req.body;


    const result = await postService.updatePostIntoDB(postId as string, payload, authorId, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Post updated successfully",
        data: {
            result
        }
    })
})
const deletePost = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.user?.id;
    const isAdmin = req.user?.Role === "ADMIN";
    const postId = req.params.postId;


    await postService.deletePostFromDB(postId as string, authorId, isAdmin);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Post deleted successfully",
        data: null
    })
})
const getPostStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await postService.getPostStatsFromDB();

     sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "stats retrieved successfully",
        data: result
        
    })

})


export const postController = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost,
    getMyPosts,
    getPostStats,
}