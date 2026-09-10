/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SubCategoryModel from "@/models/subCategory.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { mainCategoryId } = body;

        // 1. Validation
        if (mainCategoryId === undefined || mainCategoryId === null || typeof Number(mainCategoryId) !== "number" || isNaN(Number(mainCategoryId))) {
            return sendErrorResponse("Valid mainCategoryId is required", 200);
        }

        const parsedMainCategoryId = Number(mainCategoryId);

        // 2. Query MongoDB
        // Note: Use .find() if a mainCategoryId can belong to multiple subCategories, or .findOne() if it's strictly a 1:1 relation.
        const subCategories = await SubCategoryModel.find({
            mainCategoryId: parsedMainCategoryId,
            isActive: true,
        })
            .populate("mainCategoryInfo")
            .populate("categoryInfo")
            .lean();

        if (!subCategories || subCategories.length === 0) {
            return sendErrorResponse("Sub categories not found for this categoryId", 200);
        }

        // 3. Return Success
        return sendSuccessResponse("Sub categories fetched successfully", {
            subCategories,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching sub category by categoryId",
            200
        );
    }
}