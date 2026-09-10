// app/api/brand/add-collections/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandModel, { ICollection } from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Extract ID from FormData (accepts either 'brandId' or 'id')
        const rawId = (formData.get("brandId") || formData.get("id")) as string;
        const brandId = Number(rawId);

        if (!rawId || isNaN(brandId)) {
            return sendErrorResponse("A valid brand ID is required", 400);
        }

        const brand = await BrandModel.findOne({ id: brandId });
        if (!brand) {
            return sendErrorResponse("Brand not found", 404);
        }

        // Parse collections passed as a JSON string
        const collectionsRaw = formData.get("collections") as string | null;
        if (!collectionsRaw) {
            return sendErrorResponse("Collections data is required", 400);
        }

        let parsedCollections: any[];
        try {
            parsedCollections = JSON.parse(collectionsRaw);
            if (!Array.isArray(parsedCollections)) {
                return sendErrorResponse("Collections must be an array", 400);
            }
        } catch {
            return sendErrorResponse("Invalid collections JSON format", 400);
        }

        // Optional: Process image uploads if collection files are attached in FormData (e.g. key: "collectionImage_0")
        const formattedCollections: ICollection[] = [];

        for (let i = 0; i < parsedCollections.length; i++) {
            const item = parsedCollections[i];
            let imagePath = item?.imagePath ?? "";
            let imagePathId = item?.imagePathId ?? "";

            const collectionImageFile = formData.get(`collectionImage_${i}`) as File | null;
            if (collectionImageFile && collectionImageFile.size > 0) {
                const buffer = Buffer.from(await collectionImageFile.arrayBuffer());
                const filename = `${Date.now()}-${collectionImageFile.name}`;
                const uploaded = await ImageKitService.uploadImage(
                    buffer,
                    filename,
                    "jb_hifi/brand/collections"
                );
                imagePath = uploaded.url;
                imagePathId = uploaded.fileId;
            }

            formattedCollections.push({
                imagePath,
                imagePathId,
                categoryId: item?.categoryId !== undefined && item?.categoryId !== null
                    ? Number(item.categoryId)
                    : undefined,
                mainCategoryId: item?.mainCategoryId !== undefined && item?.mainCategoryId !== null
                    ? Number(item.mainCategoryId)
                    : undefined,
                subCategoryId: item?.subCategoryId !== undefined && item?.subCategoryId !== null
                    ? Number(item.subCategoryId)
                    : undefined,
                compareLink: item?.compareLink ?? "",
            });
        }

        brand.collections = formattedCollections;
        await brand.save();

        return sendSuccessResponse("Collections updated successfully", {
            collections: brand.collections,
        });
    } catch (error: any) {
        console.error("Error updating collections:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}