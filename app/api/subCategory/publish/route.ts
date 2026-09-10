/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import SubCategoryModel from "@/models/subCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Sub category ID is required", 400);
        }

        const subCategory = await SubCategoryModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!subCategory) {
            return sendErrorResponse("Sub category not found", 404);
        }

        return sendSuccessResponse(
            `Sub category ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { subCategory }
        );
    } catch (error: any) {
        console.error("Error toggling sub category publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
