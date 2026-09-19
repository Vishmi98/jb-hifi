// app/api/product/create/route.ts
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

        // Required Fields
        const title = (formData.get("title") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();
        const mainImageFile = formData.get("mainImage") as File | null;

        if (!title || !slug) {
            return sendErrorResponse("Title and slug are required", 400);
        }

        if (!mainImageFile || mainImageFile.size === 0) {
            return sendErrorResponse("A main image is required", 400);
        }

        // Duplicate check
        const existingProduct = await ProductModel.findOne({ $or: [{ slug }] });
        if (existingProduct) {
            return sendErrorResponse("Product with this slug already exists", 400);
        }

        // Upload main image to ImageKit
        const buffer = Buffer.from(await mainImageFile.arrayBuffer());
        const filename = `${Date.now()}-${mainImageFile.name}`;
        const uploaded = await ImageKitService.uploadImage(
            buffer,
            filename,
            "jb_hifi/products"
        );

        // Auto-increment ID sequence
        const lastProduct = await ProductModel.findOne().sort({ id: -1 }).lean();
        const nextId = lastProduct ? lastProduct.id + 1 : 1;

        // Create record
        const product = await ProductModel.create({
            id: nextId,
            title,
            slug,
            keyFeatures: parseJSON(formData.get("keyFeatures"), []),

            // Categorization & Foreign Keys
            brandId: parseNumber(formData.get("brandId"), 0),
            storeId: parseNumber(formData.get("storeId"), 0),
            categoryId: parseNumber(formData.get("categoryId"), 0),
            mainCategoryId: parseNumber(formData.get("mainCategoryId"), 0),
            subCategoryId: parseNumber(formData.get("subCategoryId"), 0),
            leafCategoryId: parseNumber(formData.get("leafCategoryId"), 0),

            // Pricing & Inventory
            sellType: parseNumber(formData.get("sellType"), 0),
            tagLineId: parseNumber(formData.get("tagLineId"), 0),
            paymentMethods: parseJSON(formData.get("paymentMethods"), []),

            // Media
            mainImage: uploaded.url,
            mainImageId: uploaded.fileId,

            // Meta Flags
            isFeatured: parseBool(formData.get("isFeatured"), false),
            isActive: parseBool(formData.get("isActive"), false),
            tags: parseJSON(formData.get("tags"), []),
        });

        await publishDataChange("products");

        return sendSuccessResponse("Product created successfully", { product });
    } catch (error: any) {
        console.error("Error creating product:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}