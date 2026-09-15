/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import LeafCategoryModel from "@/models/leafCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Leaf category ID is required", 400);
        }

        const leafCategory = await LeafCategoryModel.findOneAndDelete({ id: Number(id) });

        if (!leafCategory) {
            return sendErrorResponse("Leaf category not found", 404);
        }

        await publishDataChange("leafCategories");

        return sendSuccessResponse("Leaf category deleted successfully", { leafCategory });
    } catch (error: any) {
        console.error("Error deleting leaf category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
