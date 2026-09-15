/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, categoryId, mainCategoryId, subCategoryId, leafCategoryId } = body;

        const brandId = Number(id);
        if (!id || isNaN(brandId)) {
            return sendErrorResponse("A valid brand ID is required", 200);
        }

        const brand = await BrandModel.findOne({ id: brandId });
        if (!brand) {
            return sendErrorResponse("Brand not found", 200);
        }

        // Target updating redirect paths specifically for brands with no single page
        if (brand.haveSinglePage) {
            return sendErrorResponse(
                "Redirect category paths can only be configured when 'haveSinglePage' is set to false",
                200
            );
        }

        // Apply provided numeric category IDs (falling back to 0 if not provided)
        brand.categoryId = categoryId !== undefined ? Number(categoryId) : brand.categoryId ?? 0;
        brand.mainCategoryId = mainCategoryId !== undefined ? Number(mainCategoryId) : brand.mainCategoryId ?? 0;
        brand.subCategoryId = subCategoryId !== undefined ? Number(subCategoryId) : brand.subCategoryId ?? 0;
        brand.leafCategoryId = leafCategoryId !== undefined ? Number(leafCategoryId) : brand.leafCategoryId ?? 0;

        await brand.save();

        await publishDataChange("brands");

        return sendSuccessResponse("Brand redirect path updated successfully", { brand });
    } catch (error: any) {
        console.error("Error updating brand redirect path:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}