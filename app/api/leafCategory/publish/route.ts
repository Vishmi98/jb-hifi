/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import LeafCategoryModel from "@/models/leafCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Leaf category ID is required", 400);
        }

        const leafCategory = await LeafCategoryModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!leafCategory) {
            return sendErrorResponse("Leaf category not found", 404);
        }

        return sendSuccessResponse(
            `Leaf category ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { leafCategory }
        );
    } catch (error: any) {
        console.error("Error toggling leaf category publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
