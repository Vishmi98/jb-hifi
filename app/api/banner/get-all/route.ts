/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import "@/models/subCategory.model";
import "@/models/leafCategory.model";
import "@/models/brand.model";
import "@/models/product.model";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BannerModel from "@/models/banner.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;
        const totalBanners = await BannerModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalBanners / limit);
            const banners = await BannerModel.find()
                .populate({ path: "items.brandInfo" })
                .populate({ path: "items.productInfo" })
                .populate({ path: "items.categoryInfo" })
                .populate({
                    path: "items.mainCategoryInfo",
                })
                .populate({
                    path: "items.subCategoryInfo",
                })
                .populate({
                    path: "items.leafCategoryInfo",
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Banner collections fetched successfully", {
                page,
                limit,
                totalPages,
                totalBanners,
                banners,
            });
        }

        const banners = await BannerModel.find({ isActive: true })
            .populate({ path: "items.brandInfo" })
            .populate({ path: "items.productInfo" })
            .populate({ path: "items.categoryInfo" })
            .populate({
                path: "items.mainCategoryInfo",
            })
            .populate({
                path: "items.subCategoryInfo",
            })
            .populate({
                path: "items.leafCategoryInfo",
            })
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse("All banner collections fetched successfully", {
            totalBanners,
            banners,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
