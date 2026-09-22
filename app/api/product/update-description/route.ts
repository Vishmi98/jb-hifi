/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";
import { parseJSON, parseNumber } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Identify Target Product
        const productIdRaw = formData.get("productId") as string;
        if (!productIdRaw) {
            return sendErrorResponse("productId is required", 400);
        }

        const parsedProductId = parseNumber(productIdRaw, NaN);
        const query = !isNaN(parsedProductId) ? { id: parsedProductId } : { _id: productIdRaw };

        // 2. Fetch existing product to evaluate current description state
        const existingProduct = await ProductModel.findOne(query);
        if (!existingProduct) {
            return sendErrorResponse("Product not found", 404);
        }

        const currentDesc = existingProduct.description || {};

        // 3. Extract JSON object payload if provided as single payload
        const descriptionJsonStr = formData.get("description") as string;
        let parsedDescJson: Record<string, any> | null = null;
        if (descriptionJsonStr) {
            parsedDescJson = parseJSON(descriptionJsonStr, null);
        }

        // 4. Determine merged field values (Fallback to current values if omitted)
        const paragraph1 = parsedDescJson && parsedDescJson.paragraph1 !== undefined
            ? String(parsedDescJson.paragraph1).trim()
            : formData.has("paragraph1")
                ? String(formData.get("paragraph1") || "").trim()
                : currentDesc.paragraph1 ?? "";

        const paragraph2 = parsedDescJson && parsedDescJson.paragraph2 !== undefined
            ? String(parsedDescJson.paragraph2).trim()
            : formData.has("paragraph2")
                ? String(formData.get("paragraph2") || "").trim()
                : currentDesc.paragraph2 ?? "";

        const paragraph3 = parsedDescJson && parsedDescJson.paragraph3 !== undefined
            ? String(parsedDescJson.paragraph3).trim()
            : formData.has("paragraph3")
                ? String(formData.get("paragraph3") || "").trim()
                : currentDesc.paragraph3 ?? "";

        const videoUrl = parsedDescJson && parsedDescJson.videoUrl !== undefined
            ? String(parsedDescJson.videoUrl).trim()
            : formData.has("videoUrl")
                ? String(formData.get("videoUrl") || "").trim()
                : currentDesc.videoUrl ?? "";

        let features = currentDesc.features || [];
        if (parsedDescJson && Array.isArray(parsedDescJson.features)) {
            features = parsedDescJson.features;
        } else if (formData.has("features")) {
            const rawFeatures = formData.get("features");
            features = parseJSON(rawFeatures as string, currentDesc.features || []);
        }

        // 5. Save updated description subdocument
        const updatedProduct = await ProductModel.findOneAndUpdate(
            query,
            {
                $set: {
                    "description.paragraph1": paragraph1,
                    "description.paragraph2": paragraph2,
                    "description.paragraph3": paragraph3,
                    "description.features": features,
                    "description.videoUrl": videoUrl,
                },
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("products");

        return sendSuccessResponse("Product description updated successfully", {
            product: updatedProduct,
        });
    } catch (error: any) {
        console.error("Error updating product description:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}