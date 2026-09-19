// app/api/product/delete-image/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";
import { parseNumber } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Retrieve product identifier (supports numeric custom `id` or MongoDB `_id`)
        const productIdRaw = (formData.get("productId") || formData.get("id")) as string;
        if (!productIdRaw) {
            return sendErrorResponse("productId is required", 400);
        }

        const imageId = formData.get("imageId") as string | null;
        const imageUrl = formData.get("imageUrl") as string | null;
        const indexRaw = formData.get("index") as string | null;

        if (!imageId && !imageUrl && indexRaw === null) {
            return sendErrorResponse("Provide imageId, imageUrl, or index to delete", 400);
        }

        // Find product by numeric custom id or MongoDB _id
        const parsedId = parseNumber(productIdRaw, NaN);
        const query = !isNaN(parsedId) ? { id: parsedId } : { _id: productIdRaw };

        const product = await ProductModel.findOne(query);
        if (!product) {
            return sendErrorResponse("Product not found", 404);
        }

        let targetIndex = -1;

        if (imageId && product.imageIds) {
            targetIndex = product.imageIds.indexOf(imageId);
        } else if (imageUrl && product.images) {
            targetIndex = product.images.indexOf(imageUrl);
        } else if (indexRaw !== null) {
            targetIndex = Number(indexRaw);
        }

        if (
            targetIndex < 0 ||
            !product.images ||
            targetIndex >= product.images.length
        ) {
            return sendErrorResponse("Product image not found", 404);
        }

        // Delete from ImageKit if fileId exists
        const fileIdToDelete = product.imageIds?.[targetIndex];
        if (fileIdToDelete) {
            try {
                await ImageKitService.deleteImage(fileIdToDelete);
            } catch (imgError) {
                console.error("Failed to delete image from ImageKit:", imgError);
            }
        }

        // Remove from arrays
        product.images.splice(targetIndex, 1);
        if (product.imageIds) {
            product.imageIds.splice(targetIndex, 1);
        }

        await product.save();

        await publishDataChange("products");

        return sendSuccessResponse("Product image deleted successfully", {
            images: product.images,
            imageIds: product.imageIds,
        });
    } catch (error: any) {
        console.error("Error deleting product image:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}