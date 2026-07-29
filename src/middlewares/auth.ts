import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../utils/catchAsync"
import { jwtUtils } from "../utils/jwt"
import config from "../config"
import { JwtPayload } from "jsonwebtoken"
import httpstatus from "http-status"
import { prisma } from "../lib/prisma"
import { Role } from "../../generated/prisma/enums"

declare global {
    namespace Express {
        interface Request {
            user: any
        }
    }
}


export const auth = (...requiredRoles: Role[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken
            || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.headers.authorization
            )
        if (!token) {
            throw new Error("You need to logged in to complete this")
        }

        const verifiedToken = jwtUtils.verifyToken(token, config.jwt_access_secret);
        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
        }

        const { id, name, email, role } = verifiedToken.data as JwtPayload;

        if (!requiredRoles.length || !requiredRoles.includes(role)) {
            res.status(httpstatus.FORBIDDEN).json({
                success: false,
                statusCode: httpstatus.FORBIDDEN,
                message: "Forbidden! You don't have permission to access this resource. "
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                id,
                name,
                email,
                role
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        if (user.activeStatus === "BLOCKED") {
            throw new Error("Your account has been blocked, please contact support")
        }

        req.user = {
            id,
            name,
            email,
            role
        }

        next();

    }

    )
}