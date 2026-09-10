/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export const sendSuccessResponse = (message: string, data: any = {}) => {
    return NextResponse.json(
        {
            success: true,
            message,
            data,
        },
        { status: 200 }
    );
};

export const sendErrorResponse = (
    message = "An unexpected error occurred",
    statusCode = 500
) => {
    return NextResponse.json(
        {
            success: false,
            message,
        },
        { status: statusCode }
    );
};
