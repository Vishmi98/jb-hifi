/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StoreModel from "@/models/store.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Store ID is required", 400);
        }

        const store = await StoreModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!store) {
            return sendErrorResponse("Store not found", 404);
        }

        await publishDataChange("stores");

        return sendSuccessResponse(
            `Store ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { store }
        );
    } catch (error: any) {
        console.error("Error toggling store publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
