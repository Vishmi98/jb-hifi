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
        const { page, limit } = body;
        const totalLeafCategories = await LeafCategoryModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalLeafCategories / limit);
            const leafCategories = await LeafCategoryModel.find()
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
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Leaf categories fetched successfully", {
                page,
                limit,
                totalPages,
                totalLeafCategories,
                leafCategories,
            });
        }

        const leafCategories = await LeafCategoryModel.find({ isActive: true })
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
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse("All leaf categories fetched successfully", {
            totalLeafCategories,
            leafCategories,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
