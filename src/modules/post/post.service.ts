import { title } from "node:process";
import { commentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IPostQuery, IUpdatePostPayload } from "./post.interface";
import { PostWhereInput } from "../../../generated/prisma/models";

const createPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorID: userId
        }
    })
    return result;
}

const getAllPostsFromDB = async (query: IPostQuery) => {

    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.orderBy ? query.orderBy : "createdAt";
    const sortOrder = query.sortOrder ? query.sortOrder : "desc";
    const tag = query.tag ? JSON.parse(query.tag as string) : null;
    const tagsArray = Array.isArray(tag) ? tag : [];


    const andConditions: PostWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            
                OR: [
                    {
                        title: {
                            contains: query.searchTerm,
                            mode: "insensitive",
                        },

                    },
                    {
                        content: {
                            contains: query.searchTerm,
                            mode: "insensitive"
                        }
                    }
                ]         
        })
    }

    if(query.title){
        andConditions.push(
            {
                title: query.title
            }
        )
    }

    if(query.content){
        andConditions.push({
            content: query.content
        })
    }
    

    if(query.authorID){
        andConditions.push({
            authorID: query.authorID
        })
    }

    if(query.isFeature){
        andConditions.push({
            isFeature: Boolean(query.isFeature)
        })
    }


    if(query.tag){
        andConditions.push({
            tag:{
                hasSome: tagsArray
            }
        })
    }

    if(query.status){
        andConditions.push({
            status: query.status
        })
    }

    const posts = await prisma.post.findMany({

        // searching and partial match



        //filtering

        // where: {
        //     AND: [
        //         {
        //             title: "About CR7"
        //         },
        //         {
        //             content: "CR7 is the best"
        //         },
        //         tags: {
        //             equal: {
        //                 []
        //             }
        //         }
        //     ]
        // },


        // filtering and searching combined 

        // where: {
        //     AND: [
        //         {
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: "about",
        //                         mode: "insensitive"
        //                     }
        //                 },
        //                 {
        //                     content: {
        //                         contains: "Best",
        //                         mode: "insensitive"
        //                     },
        //                 },
        //             ],
        //         },
        //         {
        //             title: "About CR7",
        //         },
        //         {
        //             content: "CR7 is the best"
        //         }
        //     ]
        // },

        // take: 1,
        // skip: 0,

        // // sorting in ascinding or descinding order
        // orderBy: {
        //     createdAt: "desc",
        //     title: "asc",
        //     content: "asc"
        // },


        // where: {
        //     AND: [

        //         query.searchTerm ? {
        //             OR: [
        //                 {
        //                     title: {
        //                         contains: query.searchTerm,
        //                         mode: "insensitive",
        //                     },

        //                 },
        //                 {
        //                     content: {
        //                         contains: query.searchTerm,
        //                         mode: "insensitive"
        //                     }
        //                 }
        //             ]
        //         } : {},



        //         // Title filtering
        //         query.title ? {
        //             title: query.title
        //         } : {},

        //         // Content filtering
        //         query.content ? {
        //             content: query.content
        //         } : {}
        //     ],
        // },

        where: {
            AND: andConditions
        },

        take: limit,
        skip: skip,

        orderBy: {
            //sortBy: sortOrder
            [sortBy]: sortOrder
        },

        include: {
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


const getPostByIdFromDB = async (postId: string) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: { id: postId }
    })

    const updatePost = await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            views: {
                increment: 1
            }
        },
        include: {
            author: {
                omit: {
                    password: true
                }
            },
            comments: true
        }
    })
    return updatePost;
}


const getMyPostsFromDB = async (userId: string) => {
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

const updatePostIntoDB = async (postId: string, payload: IUpdatePostPayload, authorID: string, isAdmin: boolean) => {

    const transactionResult = await prisma.$transaction(
        async (tx) => {
            await tx.post.update({
                where: {
                    id: postId
                },
                data: payload,
                include: {
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

            const post = await tx.post.findUniqueOrThrow({
                where: {
                    id: postId
                },
                include: {
                    author: {
                        omit: {
                            password: true
                        }
                    },
                    comments: {
                        where: {
                            status: commentStatus.APPROVED
                        }
                    },
                    _count: {
                        select: {
                            comments: true
                        }
                    }
                }
            })
            return post
        }
    )

    return transactionResult;


}

const getPostStatsFromDB = async () => {
    const transactionResult = await prisma.$transaction(
        async (tx) => {



            const [totalPosts,
                totalPublishedPost,
                totalDraftPost,
                totalArchivePost,
                totalComment,
                totalApprovedComment,
                totalRejectedComment,
                totalPostViews] = await Promise.all([
                    await tx.post.count(),
                    await tx.post.count({
                        where: {
                            status: PostStatus.PUBLISHED
                        }
                    }),
                    await tx.post.count({
                        where: {
                            status: PostStatus.DRAFT
                        }
                    }),
                    await tx.post.count({
                        where: {
                            status: PostStatus.ARCHIVED
                        }
                    }),
                    await tx.comment.count(),

                    await tx.comment.count({
                        where: {
                            status: commentStatus.APPROVED
                        }
                    }),
                    await tx.comment.count({
                        where: {
                            status: commentStatus.REJECTED
                        }
                    }),

                    await tx.post.aggregate({
                        _sum: {
                            views: true
                        }
                    })
                ])

            return {
                totalPosts,
                totalPublishedPost,
                totalDraftPost,
                totalArchivePost,
                totalComment,
                totalApprovedComment,
                totalRejectedComment,
                totalPostViews: totalPostViews._sum.views
            }
        }
    )
    return transactionResult;

}











const deletePostFromDB = async (postId: string, authorID: string, isAdmin: boolean) => {
    const post = await prisma.post.findUniqueOrThrow({
        where: {
            id: postId
        }
    })

    if (!isAdmin && post.authorID !== authorID) {
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
    getPostStatsFromDB,
    deletePostFromDB
}