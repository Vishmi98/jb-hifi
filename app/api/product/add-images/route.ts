/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";
import { parseNumber } from "@/utils/api.utils";

const MAX_IMAGE_COUNT = 10;

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Retrieve product identifier (supports numeric custom `id` or MongoDB `_id`)
        const productIdRaw = formData.get("productId") as string;
        if (!productIdRaw) {
            return sendErrorResponse("productId is required", 200);
        }

        // Extract image files from formData
        const imageFiles = formData.getAll("images") as File[];

        if (!imageFiles || imageFiles.length === 0) {
            return sendErrorResponse("At least one image file is required", 200);
        }

        // Validate max image limit (up to 10 images)
        if (imageFiles.length > MAX_IMAGE_COUNT) {
            return sendErrorResponse(
                `You can upload a maximum of ${MAX_IMAGE_COUNT} images at a time`,
                200
            );
        }

        // Find the targeted product
        const parsedId = parseNumber(productIdRaw, NaN);
        const query = !isNaN(parsedId) ? { id: parsedId } : { _id: productIdRaw };

        const product = await ProductModel.findOne(query);

        if (!product) {
            return sendErrorResponse("Product not found", 404);
        }

        // Check total resulting image count limit
        const existingImagesCount = product.images?.length || 0;
        if (existingImagesCount + imageFiles.length > MAX_IMAGE_COUNT) {
            const availableSlots = MAX_IMAGE_COUNT - existingImagesCount;
            return sendErrorResponse(
                `Product already has ${existingImagesCount} images. You can only add ${availableSlots} more (Maximum limit is ${MAX_IMAGE_COUNT}).`,
                200
            );
        }

        // Process and upload each image concurrently to ImageKit
        const uploadPromises = imageFiles.map(async (file) => {
            if (file.size === 0) {
                throw new Error(`File ${file.name} is empty`);
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

            return await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/products/gallery"
            );
        });

        const uploadResults = await Promise.all(uploadPromises);

        const newImageUrls = uploadResults.map((res) => res.url);
        const newImageIds = uploadResults.map((res) => res.fileId);

        // Append new images to the product record
        const updatedProduct = await ProductModel.findOneAndUpdate(
            query,
            {
                $push: {
                    images: { $each: newImageUrls },
                    imageIds: { $each: newImageIds },
                },
            },
            { new: true }
        );

        await publishDataChange("products");

        return sendSuccessResponse("Product images uploaded successfully", {
            product: updatedProduct,
            addedCount: uploadResults.length,
        });
    } catch (error: any) {
        console.error("Error uploading product images:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}