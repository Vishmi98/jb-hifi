/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import MainCategoryModel from "@/models/mainCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Main category ID is required", 400);
        }

        const mainCategory = await MainCategoryModel.findOneAndDelete({ id: Number(id) });

        if (!mainCategory) {
            return sendErrorResponse("Main category not found", 404);
        }

        return sendSuccessResponse("Main category deleted successfully", { mainCategory });
    } catch (error: any) {
        console.error("Error deleting main category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
