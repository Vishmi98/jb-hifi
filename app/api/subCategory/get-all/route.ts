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
        const { page, limit } = body;
        const totalSubCategories = await SubCategoryModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalSubCategories / limit);
            const subCategories = await SubCategoryModel.find()
                .populate({
                    path: "mainCategoryInfo",
                    populate: {
                        path: "categoryInfo",
                    },
                })
                .populate("categoryInfo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Sub categories fetched successfully", {
                page,
                limit,
                totalPages,
                totalSubCategories,
                subCategories,
            });
        }

        const subCategories = await SubCategoryModel.find({ isActive: true })
            .populate({
                path: "mainCategoryInfo",
                populate: {
                    path: "categoryInfo",
                },
            })
            .populate("categoryInfo")
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse("All sub categories fetched successfully", {
            totalSubCategories,
            subCategories,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
