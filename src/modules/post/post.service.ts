import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data:{
            ...payload,
            authorID: userId
        }
    })
    return result;
}

const getAllPostsFromDB = async() => {
    const posts = await prisma.post.findMany({
        include:{
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    });
    return posts;
}


const getPostByIdFromDB = async(postId: string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {id: postId}
    })

    const updatePost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views : {
                increment: 1
            }
        },
        include:{
            author:{
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
    return updatePost;
}


const getMyPostsFromDB = async(userId: string) => {
    const posts = await prisma.post.findMany({
        where: {
            authorID: userId
        },
        orderBy: {
            createdAt: "desc"
        },
        include: {
            comments: true,
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            }
        }
    })
    return posts;
}

const updatePostIntoDB = async(postId: string, payload: IUpdatePostPayload, authorID: string, isAdmin: boolean) =>{
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id: postId
        }
    })

    if(!isAdmin && post.authorID !== authorID){
        throw new Error("You are not eligible to do this task")
    }

    const result = await prisma.post.update({
        where: {
            id: postId
        },
        data: payload,
        include:{
            author: {
                omit: {
                    password: true
                }
            },
            _count: {
                select: {
                    comments: true
                }
            },
            comments: true
        }
    })

    return result;
}


const deletePostFromDB = async(postId: string, authorID: string, isAdmin: boolean) =>{
    const post = await prisma.post.findUniqueOrThrow({
        where:{
            id: postId
        }
    })

    if(!isAdmin && post.authorID !== authorID){
        throw new Error("You are not eligible to do this task")
    }

    await prisma.post.delete({
        where: {
            id: postId
        }
    })
}












export const postService = {
    createPostIntoDB,
    getAllPostsFromDB,
    getPostByIdFromDB,
    getMyPostsFromDB,
    updatePostIntoDB,
    deletePostFromDB
}