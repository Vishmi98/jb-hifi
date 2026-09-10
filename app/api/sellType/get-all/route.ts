/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SellTypeModel from "@/models/sellType.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;
        const totalSellTypes = await SellTypeModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalSellTypes / limit);
            const sellTypes = await SellTypeModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Sell types fetched successfully", {
                page,
                limit,
                totalPages,
                totalSellTypes,
                sellTypes,
            });
        }

        const sellTypes = await SellTypeModel.find().sort({ createdAt: -1 }).lean();

        return sendSuccessResponse("All sell types fetched successfully", {
            totalSellTypes,
            sellTypes,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}