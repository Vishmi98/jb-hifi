// app/api/banner/add-item/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BannerModel, { IItem } from "@/models/banner.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Extract and validate Banner ID (accepts 'bannerId' or 'id')
        const rawBannerId = (formData.get("bannerId") || formData.get("id")) as string;
        const bannerId = Number(rawBannerId);

        if (!rawBannerId || isNaN(bannerId)) {
            return sendErrorResponse("A valid banner ID is required", 200);
        }

        const banner = await BannerModel.findOne({ id: bannerId });
        if (!banner) {
            return sendErrorResponse("Banner not found", 200);
        }

        // 2. Extract and validate Image File
        const imageFile = formData.get("image") as File | null;
        if (!imageFile || imageFile.size === 0) {
            return sendErrorResponse("An image file is required", 200);
        }

        // 3. Extract optional relational category / entity IDs
        const categoryId = formData.get("categoryId") ? Number(formData.get("categoryId")) : undefined;
        const mainCategoryId = formData.get("mainCategoryId") ? Number(formData.get("mainCategoryId")) : undefined;
        const subCategoryId = formData.get("subCategoryId") ? Number(formData.get("subCategoryId")) : undefined;
        const leafCategoryId = formData.get("leafCategoryId") ? Number(formData.get("leafCategoryId")) : undefined;
        const brandId = formData.get("brandId") ? Number(formData.get("brandId")) : undefined;
        const productId = formData.get("productId") ? Number(formData.get("productId")) : undefined;

        // 4. Upload image to ImageKit
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filename = `${Date.now()}-${imageFile.name}`;
        const uploaded = await ImageKitService.uploadImage(
            buffer,
            filename,
            "jb_hifi/banners"
        );

        // 5. Generate unique numeric item ID within the banner items array
        const existingItemIds = banner.items.map((item: IItem) => item.id);
        const nextItemId = existingItemIds.length > 0 ? Math.max(...existingItemIds) + 1 : 1;

        // 6. Construct new item object matching IItem interface
        const newItem = {
            id: nextItemId,
            imagePath: uploaded.url,
            imageId: uploaded.fileId,
            ...(categoryId && !isNaN(categoryId) && { categoryId }),
            ...(mainCategoryId && !isNaN(mainCategoryId) && { mainCategoryId }),
            ...(subCategoryId && !isNaN(subCategoryId) && { subCategoryId }),
            ...(leafCategoryId && !isNaN(leafCategoryId) && { leafCategoryId }),
            ...(brandId && !isNaN(brandId) && { brandId }),
            ...(productId && !isNaN(productId) && { productId }),
        };

        // 7. Update document and save
        banner.items.push(newItem);
        await banner.save();

        await publishDataChange("bannerItems");

        return sendSuccessResponse("Banner item added successfully", {
            banner,
            addedItem: newItem,
        });
    } catch (error: any) {
        console.error("Error adding item to banner:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}