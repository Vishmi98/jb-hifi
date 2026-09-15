/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import "@/models/subCategory.model";
import "@/models/leafCategory.model";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;

        let brands;
        const totalBrands = await BrandModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalBrands / limit);

            brands = await BrandModel.find()
                .sort({ createdAt: -1 })
                .populate({
                    path: "collections.categoryInfo",
                })
                .populate({
                    path: "collections.mainCategoryInfo",
                })
                .populate({
                    path: "collections.subCategoryInfo",
                })
                .populate({
                    path: "categoryInfo",
                })
                .populate({
                    path: "mainCategoryInfo",
                })
                .populate({
                    path: "subCategoryInfo",
                })
                .populate({
                    path: "leafCategoryInfo",
                })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Brands fetched successfully", {
                page,
                limit,
                totalPages,
                totalBrands,
                brands,
            });
        }

        brands = await BrandModel.find({ isActive: true })
            .sort({ createdAt: 1 })
            .populate({
                path: "collections.categoryInfo",
            })
            .populate({
                path: "collections.mainCategoryInfo",
            })
            .populate({
                path: "collections.subCategoryInfo",
            })
            .populate({
                path: "categoryInfo",
            })
            .populate({
                path: "mainCategoryInfo",
            })
            .populate({
                path: "subCategoryInfo",
            })
            .populate({
                path: "leafCategoryInfo",
            })
            .lean();

        return sendSuccessResponse("All brands fetched successfully", {
            totalBrands,
            brands,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}