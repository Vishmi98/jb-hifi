/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import MainCategoryModel from "@/models/mainCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Main category ID is required", 400);
        }

        const mainCategory = await MainCategoryModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!mainCategory) {
            return sendErrorResponse("Main category not found", 404);
        }

        return sendSuccessResponse(
            `Main category ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { mainCategory }
        );
    } catch (error: any) {
        console.error("Error toggling main category publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
