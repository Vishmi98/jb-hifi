/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import CategoryModel from "@/models/category.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({})); // Fallback for empty body
        const { page, limit } = body;

        let categories;
        const totalCategories = await CategoryModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalCategories / limit);

            categories = await CategoryModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Categories fetched successfully", {
                page,
                limit,
                totalPages,
                totalCategories,
                categories,
            });
        } else {
            categories = await CategoryModel.find({ isActive: true })
                .sort({ createdAt: -1 })
                .lean();

            return sendSuccessResponse("All categories fetched successfully", {
                totalCategories,
                categories,
            });
        }
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}