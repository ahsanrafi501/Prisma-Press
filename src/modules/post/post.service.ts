import { commentStatus, PostStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePostPayload, IUpdatePostPayload } from "./post.interface";

const createPostIntoDB = async (payload: ICreatePostPayload, userId: string) => {
    const result = await prisma.post.create({
        data: {
            ...payload,
            authorID: userId
        }
    })
    return result;
}

const getAllPostsFromDB = async () => {
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

        where: {
            AND: [
                {
                    OR: [
                        {
                            title: {
                                contains: "about",
                                mode: "insensitive"
                            }
                        },
                        {
                            content: {
                                contains: "Best",
                                mode: "insensitive"
                            },
                        },
                    ],
                },
                {
                    title: "About CR7",
                },
                {
                    content: "CR7 is the best"
                }
            ]
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