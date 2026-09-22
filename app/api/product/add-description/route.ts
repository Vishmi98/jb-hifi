/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel, { IDescription } from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";
import { parseJSON, parseNumber } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Retrieve product identifier
        const productIdRaw = formData.get("productId") as string;
        if (!productIdRaw) {
            return sendErrorResponse("productId is required", 400);
        }

        const parsedId = parseNumber(productIdRaw, NaN);
        const query = !isNaN(parsedId) ? { id: parsedId } : { _id: productIdRaw };

        // 2. Locate targeted product
        const product = await ProductModel.findOne(query);
        if (!product) {
            return sendErrorResponse("Product not found", 404);
        }

        // 3. Extract description fields from JSON string or FormData
        let descriptionPayload: IDescription = {
            paragraph1: "",
            paragraph2: "",
            paragraph3: "",
            features: [],
            videoUrl: "",
        };

        const descriptionJsonStr = formData.get("description") as string;

        if (descriptionJsonStr) {
            const parsed = parseJSON(descriptionJsonStr, null);
            if (parsed && typeof parsed === "object") {
                descriptionPayload = {
                    paragraph1: String(parsed.paragraph1 || "").trim(),
                    paragraph2: String(parsed.paragraph2 || "").trim(),
                    paragraph3: String(parsed.paragraph3 || "").trim(),
                    features: Array.isArray(parsed.features) ? parsed.features : [],
                    videoUrl: String(parsed.videoUrl || "").trim(),
                };
            }
        } else {
            const rawFeatures = formData.get("features");
            descriptionPayload = {
                paragraph1: String(formData.get("paragraph1") || "").trim(),
                paragraph2: String(formData.get("paragraph2") || "").trim(),
                paragraph3: String(formData.get("paragraph3") || "").trim(),
                features: parseJSON(rawFeatures as string, []),
                videoUrl: String(formData.get("videoUrl") || "").trim(),
            };
        }

        // 4. Update the Product Description object
        const updatedProduct = await ProductModel.findOneAndUpdate(
            query,
            {
                $set: {
                    description: descriptionPayload,
                },
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("products");

        return sendSuccessResponse("Product description added successfully", {
            product: updatedProduct,
        });
    } catch (error: any) {
        console.error("Error adding product description:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}