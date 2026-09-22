// app/api/product/delete-variant/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";
import { parseNumber } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Extract product and variant identifiers from FormData
        const productIdRaw = formData.get("productId") as string;
        const variantIdRaw = formData.get("variantId") as string;

        if (!productIdRaw) {
            return sendErrorResponse("productId is required", 400);
        }

        if (!variantIdRaw) {
            return sendErrorResponse("variantId is required", 400);
        }

        const parsedProductId = parseNumber(productIdRaw, NaN);
        const parsedVariantId = parseNumber(variantIdRaw, NaN);

        if (isNaN(parsedVariantId)) {
            return sendErrorResponse("Valid numeric variantId is required", 400);
        }

        const query = !isNaN(parsedProductId)
            ? { id: parsedProductId }
            : { _id: productIdRaw };

        // 2. Remove the variant subdocument from the product array
        const updatedProduct = await ProductModel.findOneAndUpdate(
            query,
            {
                $pull: {
                    variants: { id: parsedVariantId },
                },
            },
            { new: true }
        );

        if (!updatedProduct) {
            return sendErrorResponse("Product not found", 404);
        }

        await publishDataChange("products");

        return sendSuccessResponse("Product variant deleted successfully", {
            product: updatedProduct,
            deletedVariantId: parsedVariantId,
        });
    } catch (error: any) {
        console.error("Error deleting product variant:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}