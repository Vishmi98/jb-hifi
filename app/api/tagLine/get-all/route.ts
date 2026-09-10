/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import TagLineModel from "@/models/tagLine.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;
        const totalTagLines = await TagLineModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalTagLines / limit);
            const tagLines = await TagLineModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Tag lines fetched successfully", {
                page,
                limit,
                totalPages,
                totalTagLines,
                tagLines,
            });
        }

        const tagLines = await TagLineModel.find().sort({ createdAt: -1 }).lean();

        return sendSuccessResponse("All tag lines fetched successfully", {
            totalTagLines,
            tagLines,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
