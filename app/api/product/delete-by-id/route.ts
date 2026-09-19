/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";
import ProductModel from "@/models/product.model";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("product ID is required", 200);
        }

        const product = await ProductModel.findOneAndDelete({ id: Number(id) });

        if (!product) {
            return sendErrorResponse("Product not found", 200);
        }

        await publishDataChange("products");

        return sendSuccessResponse("Product deleted successfully", { product });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
