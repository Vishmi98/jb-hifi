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
        const { page, limit } = body;
        const totalMainCategories = await MainCategoryModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalMainCategories / limit);
            const mainCategories = await MainCategoryModel.find()
                .populate("categoryInfo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Main categories fetched successfully", {
                page,
                limit,
                totalPages,
                totalMainCategories,
                mainCategories,
            });
        }

        const mainCategories = await MainCategoryModel.find({ isActive: true })
            .populate("categoryInfo")
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse("All main categories fetched successfully", {
            totalMainCategories,
            mainCategories,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
