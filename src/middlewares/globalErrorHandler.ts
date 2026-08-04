import { NextFunction, Request, Response } from "express";
import httpstatus from "http-status"
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    let statusCode;
    let errorMessage = err.message || "Internal Server Error";
    let errorName = err.name || "Internal Server Error";

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpstatus.BAD_REQUEST;
        errorMessage = "You are provided incorrect field type or missing field"
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = httpstatus.BAD_REQUEST;
            errorMessage = "Duplicate Key Error"
        } else if (err.code === "P2003") {
            statusCode = httpstatus.BAD_REQUEST;
            errorMessage = "Foreign key constraint error"
        } else if (err.code === "P2025") {
            statusCode = httpstatus.BAD_REQUEST;
            errorMessage = "An operation failed because it depends on one or more records that were required but not found"
        }
    } else if(err instanceof Prisma.PrismaClientInitializationError){
        if(err.errorCode === "P1000"){
            statusCode = httpstatus.UNAUTHORIZED;
            errorMessage = "Authentication faild against database server. Please check crediantials"
        } 
       else if(err.errorCode === "P1001"){
            statusCode = httpstatus.BAD_REQUEST;
            errorMessage = "Can't reach database server"
        } 
    } else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = httpstatus.INTERNAL_SERVER_ERROR;
        errorMessage = "Error occurred during query execution"
    }


    res.status(httpstatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpstatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    })
}