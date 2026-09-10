/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import { connectDB } from "@/lib/mongodb";
import SubCategoryModel from "@/models/subCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { subSlug } = body;

        if (!subSlug || typeof subSlug !== "string") {
            return sendErrorResponse("Slug is required", 200);
        }

        const subCategory = await SubCategoryModel.findOne({
            subSlug: subSlug.trim(),
            isActive: true,
        })
            .populate({
                path: "mainCategoryInfo",
                populate: {
                    path: "categoryInfo",
                },
            })
            .populate("categoryInfo")
            .lean();

        if (!subCategory) {
            return sendErrorResponse("Sub category not found", 200);
        }

        return sendSuccessResponse("Sub category fetched successfully", {
            subCategory,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching sub category",
            200
        );
    }
}
