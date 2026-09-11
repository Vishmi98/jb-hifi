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
        const {
            bannerType,
            categoryId,
            mainCategoryId,
            subCategoryId,
            leafCategoryId,
            brandId,
            productId,
        } = body;

        if (!bannerType) {
            return sendErrorResponse("bannerType is required", 400);
        }

        // Base query strictly checks for active banners and matching bannerType
        const query: Record<string, any> = {
            isActive: true,
            bannerType,
        };

        // Dynamically add conditions for nested items based on provided payload parameters
        const itemConditions: Record<string, any> = {};

        if (categoryId) itemConditions["items.categoryId"] = Number(categoryId);
        if (mainCategoryId) itemConditions["items.mainCategoryId"] = Number(mainCategoryId);
        if (subCategoryId) itemConditions["items.subCategoryId"] = Number(subCategoryId);
        if (leafCategoryId) itemConditions["items.leafCategoryId"] = Number(leafCategoryId);
        if (brandId) itemConditions["items.brandId"] = Number(brandId);
        if (productId) itemConditions["items.productId"] = Number(productId);

        if (Object.keys(itemConditions).length > 0) {
            query["$or"] = Object.entries(itemConditions).map(([key, value]) => ({
                [key]: value,
            }));
        }

        const banner = await BannerModel.findOne(query)
            .populate({ path: "items.brandInfo" })
            .populate({ path: "items.productInfo" })
            .populate({ path: "items.categoryInfo" })
            .populate({ path: "items.mainCategoryInfo" })
            .populate({ path: "items.subCategoryInfo" })
            .populate({ path: "items.leafCategoryInfo" })
            .sort({ createdAt: -1 })
            .lean();

        // Return a successful HTTP 200 response with null data when no matching banner is found
        if (!banner) {
            return sendSuccessResponse("No banner found matching the criteria", null);
        }

        return sendSuccessResponse("Banner fetched successfully", banner);
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}