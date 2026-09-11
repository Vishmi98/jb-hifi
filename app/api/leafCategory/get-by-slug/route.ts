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
        const { leafSlug } = body;

        if (!leafSlug || typeof leafSlug !== "string") {
            return sendErrorResponse("Slug is required", 200);
        }

        const leafCategory = await LeafCategoryModel.findOne({
            leafSlug: leafSlug.trim(),
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

        if (!leafCategory) {
            return sendErrorResponse("Leaf category not found", 200);
        }

        return sendSuccessResponse("Leaf category fetched successfully", {
            leafCategory,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching leaf category",
            200
        );
    }
}
