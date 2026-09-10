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
        const { categoryId } = body;

        // 1. Validation
        if (categoryId === undefined || categoryId === null || typeof Number(categoryId) !== "number" || isNaN(Number(categoryId))) {
            return sendErrorResponse("Valid categoryId is required", 200);
        }

        const parsedCategoryId = Number(categoryId);

        // 2. Query MongoDB
        // Note: Use .find() if a categoryId can belong to multiple MainCategories, or .findOne() if it's strictly a 1:1 relation.
        const mainCategories = await MainCategoryModel.find({
            categoryId: parsedCategoryId,
            isActive: true,
        })
            .populate("categoryInfo")
            .lean();

        if (!mainCategories || mainCategories.length === 0) {
            return sendErrorResponse("Main categories not found for this categoryId", 200);
        }

        // 3. Return Success
        return sendSuccessResponse("Main categories fetched successfully", {
            mainCategories,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching main category by categoryId",
            200
        );
    }
}