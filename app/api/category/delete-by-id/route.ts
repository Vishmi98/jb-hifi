/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/category.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Category ID is required", 200);
        }

        const category = await CategoryModel.findOneAndDelete({ id: Number(id) });

        if (!category) {
            return sendErrorResponse("Category not found", 200);
        }

        await publishDataChange("categories");

        return sendSuccessResponse("Category deleted successfully", { category });
    } catch (error: any) {
        console.error("Error deleting category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
