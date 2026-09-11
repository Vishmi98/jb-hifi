/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import { connectDB } from "@/lib/mongodb";
import StoreModel from "@/models/store.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { slug } = body;

        if (!slug || typeof slug !== "string") {
            return sendErrorResponse("Slug is required", 200);
        }

        const store = await StoreModel.findOne({
            slug: slug.trim(),
            isActive: true,
        })
            .populate("categoryInfo")
            .lean();

        if (!store) {
            return sendErrorResponse("Store not found", 200);
        }

        return sendSuccessResponse("Store fetched successfully", {
            store,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching store",
            200
        );
    }
}
