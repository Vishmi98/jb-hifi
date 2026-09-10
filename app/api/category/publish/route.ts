/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/category.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Category ID is required", 400);
        }

        const category = await CategoryModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!category) {
            return sendErrorResponse("Category not found", 404);
        }

        return sendSuccessResponse(
            `Category ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { category }
        );
    } catch (error: any) {
        console.error("Error toggling category publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
