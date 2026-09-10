/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import { connectDB } from "@/lib/mongodb";
import MainCategoryModel from "@/models/mainCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { mainSlug } = body;

        if (!mainSlug || typeof mainSlug !== "string") {
            return sendErrorResponse("Slug is required", 200);
        }

        const mainCategory = await MainCategoryModel.findOne({
            mainSlug: mainSlug.trim(),
            isActive: true,
        })
            .populate("categoryInfo")
            .lean();

        if (!mainCategory) {
            return sendErrorResponse("Main category not found", 200);
        }

        return sendSuccessResponse("Main category fetched successfully", {
            mainCategory,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching main category",
            200
        );
    }
}
