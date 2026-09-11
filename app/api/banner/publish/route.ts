/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BannerModel from "@/models/banner.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Banner collection ID is required", 400);
        }

        const bannerCollection = await BannerModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!bannerCollection) {
            return sendErrorResponse("Banner collection not found", 404);
        }

        return sendSuccessResponse(
            `Banner collection ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { bannerCollection }
        );
    } catch (error: any) {
        console.error("Error toggling banner collection publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
