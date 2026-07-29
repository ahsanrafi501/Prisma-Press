import { NextFunction, Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import httpstatus from "http-status"
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import jwt from "jsonwebtoken";
import { jwtUtils } from "../../utils/jwt";

// const registerUser = async (req: Request, res: Response) => {
//     try {
//         const payload = req.body;

//         const user = await userService.registerUserIntoDB(payload);



//         res.status(httpstatus.CREATED).json({
//             success: true,
//             statusCode: httpstatus.CREATED,
//             message: "User Registered Successfully",
//             data: {
//                 user
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
//             success: false,
//             statusCode: httpstatus.INTERNAL_SERVER_ERROR,
//             message: "Failed to register user",
//             error: (error as Error).message
//         })
//     }

// }

const registerUser = catchAsync(

    async (req: Request, res: Response, next: NextFunction) => {
        const payload = req.body;

        const user = await userService.registerUserIntoDB(payload);

        // res.status(httpstatus.CREATED).json({
        //     success: true,
        //     statusCode: httpstatus.CREATED,
        //     message: "User Registered Successfully",
        //     data: {
        //         user
        //     }
        // })

        sendResponse(res, {
            success: true,
            statusCode: httpstatus.CREATED,
            message: "User created successfully",
            data: {
                user
            }
        })

    }
)

const getMyProfile = catchAsync( async (req: Request, res: Response, next: NextFunction) => {
    // res.send("get my profile")

    const {id} = req.user;
    // console.log(accessToken);

    // const verifyAccessToken = jwt.verify(accessToken, config.jwt_access_secret)
    // console.log(verifyAccessToken);

    // const verifyAccessToken = jwtUtils.verifyToken(accessToken, config.jwt_access_secret);
    // console.log(verifyAccessToken);
    // if(typeof verifyAccessToken === "string"){
    //     throw new Error(verifyAccessToken)
    // }
    const profile = await userService.getMyProfileFromDB(id);

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "User profile fetched Successfully",
        data: {
            profile
        }
    })


})


const updateMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const {id: userId} = req.user!;
    
    const payload = req.body;
    
    const updatedProfile = await userService.updateMyProfileIntoDB(userId, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpstatus.OK,
        message: "Profile updated successfully",
        data: {
            updatedProfile
        }
    })
})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile
}