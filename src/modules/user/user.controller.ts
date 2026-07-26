import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import bcrypt from "bcryptjs";
import httpstatus from "http-status"
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
    try {
        const payload = req.body;

        const user = await userService.registerUserIntoDB(payload);



        res.status(httpstatus.CREATED).json({
            success: true,
            statusCode: httpstatus.CREATED,
            message: "User Registered Successfully",
            data: {
                user
            }
        })
    } catch (error) {
        console.log(error);
        res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: httpstatus.INTERNAL_SERVER_ERROR,
            message: "Failed to register user",
            error: (error as Error).message
        })
    }

}

export const userController = {
    registerUser,
}