/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import SubCategoryModel from "@/models/subCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Sub category ID is required", 400);
        }

        const subCategory = await SubCategoryModel.findOneAndDelete({ id: Number(id) });

        if (!subCategory) {
            return sendErrorResponse("Sub category not found", 404);
        }

        return sendSuccessResponse("Sub category deleted successfully", { subCategory });
    } catch (error: any) {
        console.error("Error deleting sub category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
