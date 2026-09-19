// app/api/product/update/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";
import { parseBool, parseJSON, parseNumber } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Extract ID
        const rawId = (formData.get("productId") || formData.get("id")) as string;
        const productId = Number(rawId);

        if (!rawId || isNaN(productId)) {
            return sendErrorResponse("A valid product ID is required", 400);
        }

        const product = await ProductModel.findOne({ id: productId });
        if (!product) {
            return sendErrorResponse("Product not found", 404);
        }

        // Check for unique slug conflict if slug is being updated
        const slug = (formData.get("slug") as string)?.trim();
        if (slug && slug !== product.slug) {
            const existingProduct = await ProductModel.findOne({
                id: { $ne: productId },
                slug,
            });

            if (existingProduct) {
                return sendErrorResponse("Another product with this slug already exists", 400);
            }
            product.slug = slug;
        }

        // Handle Main Image Replacement
        const mainImageFile = formData.get("mainImage") as File | null;
        if (mainImageFile && mainImageFile.size > 0) {
            if (product.mainImageId) {
                try {
                    await ImageKitService.deleteImage(product.mainImageId);
                } catch (imgError) {
                    console.error("Failed to delete old product image from ImageKit:", imgError);
                }
            }

            const buffer = Buffer.from(await mainImageFile.arrayBuffer());
            const filename = `${Date.now()}-${mainImageFile.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/products"
            );

            product.mainImage = uploaded.url;
            product.mainImageId = uploaded.fileId;
        }

        // Basic Text Fields Updates
        const title = (formData.get("title") as string)?.trim();
        if (title) product.title = title;

        if (formData.has("sellType")) product.sellType = parseNumber(formData.get("sellType"), product.sellType);
        if (formData.has("tagLineId")) product.tagLineId = parseNumber(formData.get("tagLineId"), product.tagLineId);

        // Foreign Keys & Categorization Updates
        if (formData.has("brandId")) product.brandId = parseNumber(formData.get("brandId"), product.brandId);
        if (formData.has("storeId")) product.storeId = parseNumber(formData.get("storeId"), product.storeId);
        if (formData.has("categoryId")) product.categoryId = parseNumber(formData.get("categoryId"), product.categoryId);
        if (formData.has("mainCategoryId")) product.mainCategoryId = parseNumber(formData.get("mainCategoryId"), product.mainCategoryId);
        if (formData.has("subCategoryId")) product.subCategoryId = parseNumber(formData.get("subCategoryId"), product.subCategoryId);
        if (formData.has("leafCategoryId")) product.leafCategoryId = parseNumber(formData.get("leafCategoryId"), product.leafCategoryId);

        // Status & Toggle Flags Updates
        if (formData.has("isFeatured")) product.isFeatured = parseBool(formData.get("isFeatured"), product.isFeatured);
        if (formData.has("isActive")) product.isActive = parseBool(formData.get("isActive"), product.isActive);

        // Complex Objects & Arrays Updates
        if (formData.has("keyFeatures")) product.keyFeatures = parseJSON(formData.get("keyFeatures"), product.keyFeatures);
        if (formData.has("paymentMethods")) product.paymentMethods = parseJSON(formData.get("paymentMethods"), product.paymentMethods);
        if (formData.has("tags")) product.tags = parseJSON(formData.get("tags"), product.tags);

        await product.save();
        await publishDataChange("products");

        return sendSuccessResponse("Product updated successfully", { product });
    } catch (error: any) {
        console.error("Error updating product:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}