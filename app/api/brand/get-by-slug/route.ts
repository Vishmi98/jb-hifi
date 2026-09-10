/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import "@/models/subCategory.model";
import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BrandModel from "@/models/brand.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { slug } = body;

        // Validate required field
        if (!slug || typeof slug !== "string") {
            return sendErrorResponse("Slug is required", 200);
        }

        // Find published brand matching the slug
        const brand = await BrandModel.findOne({
            slug: slug.trim(),
            isActive: true,
        })
            .populate({
                path: "collections.categoryInfo",
            })
            .populate({
                path: "collections.mainCategoryInfo",
            })
            .populate({
                path: "collections.subCategoryInfo",
            })
            .lean();

        if (!brand) {
            return sendErrorResponse("Brand not found", 200);
        }

        return sendSuccessResponse("Brand fetched successfully", {
            brand,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching brand",
            200
        );
    }
}