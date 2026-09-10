/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import CategoryModel from "@/models/category.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { slug } = body;

        // Validate required field
        if (!slug || typeof slug !== "string") {
            return sendErrorResponse("Slug is required", 200);
        }

        // Find published category matching the slug
        const category = await CategoryModel.findOne({
            slug: slug.trim(),
            isActive: true,
        }).lean();

        if (!category) {
            return sendErrorResponse("Category not found", 200);
        }

        return sendSuccessResponse("Category fetched successfully", {
            category,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching category",
            200
        );
    }
}