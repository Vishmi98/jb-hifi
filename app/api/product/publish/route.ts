/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";
import ProductModel from "@/models/product.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id, isPublish } = body;

        if (!id) {
            return sendErrorResponse("Product ID is required", 200);
        }

        const product = await ProductModel.findOneAndUpdate(
            { id: Number(id) },
            { isActive: Boolean(isPublish) },
            { new: true }
        );

        if (!product) {
            return sendErrorResponse("Product not found", 200);
        }

        await publishDataChange("products");

        return sendSuccessResponse(
            `Product ${Boolean(isPublish) ? "published" : "unpublished"} successfully`,
            { product }
        );
    } catch (error: any) {
        console.error("Error toggling product publish state:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
