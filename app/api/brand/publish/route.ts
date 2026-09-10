/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BrandModel from "@/models/brand.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Brand ID is required", 200);
        }

        const brand = await BrandModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!brand) {
            return sendErrorResponse("Brand not found", 200);
        }

        return sendSuccessResponse(
            `Brand ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { brand }
        );
    } catch (error: any) {
        console.error("Error toggling brand publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
