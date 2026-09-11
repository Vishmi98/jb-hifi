/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import "@/models/subCategory.model";
import { connectDB } from "@/lib/mongodb";
import LeafCategoryModel from "@/models/leafCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { subCategoryId } = body;

        if (subCategoryId === undefined || subCategoryId === null || typeof Number(subCategoryId) !== "number" || isNaN(Number(subCategoryId))) {
            return sendErrorResponse("Valid subCategoryId is required", 200);
        }

        const parsedSubCategoryId = Number(subCategoryId);

        const leafCategories = await LeafCategoryModel.find({
            subCategoryId: parsedSubCategoryId,
            isActive: true,
        })
            .populate({
                path: "categoryInfo",
            })
            .populate({
                path: "mainCategoryInfo",
                populate: {
                    path: "categoryInfo",
                },
            })
            .populate({
                path: "subCategoryInfo",
                populate: {
                    path: "mainCategoryInfo",
                },
            })
            .lean();

        if (!leafCategories || leafCategories.length === 0) {
            return sendErrorResponse("Leaf categories not found for this subCategoryId", 200);
        }

        return sendSuccessResponse("Leaf categories fetched successfully", {
            leafCategories,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching leaf categories by subCategoryId",
            200
        );
    }
}
