// app/api/brand/delete-banner/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const rawId = (formData.get("brandId") || formData.get("id")) as string;
        const brandId = Number(rawId);

        if (!rawId || isNaN(brandId)) {
            return sendErrorResponse("A valid brand ID is required", 400);
        }

        const bannerImageId = formData.get("bannerImageId") as string | null;
        const bannerImageUrl = formData.get("bannerImageUrl") as string | null;
        const indexRaw = formData.get("index") as string | null;

        if (!bannerImageId && !bannerImageUrl && indexRaw === null) {
            return sendErrorResponse("Provide bannerImageId, bannerImageUrl, or index to delete", 400);
        }

        const brand = await BrandModel.findOne({ id: brandId });
        if (!brand) {
            return sendErrorResponse("Brand not found", 404);
        }

        let targetIndex = -1;

        if (bannerImageId && brand.bannerImageIds) {
            targetIndex = brand.bannerImageIds.indexOf(bannerImageId);
        } else if (bannerImageUrl && brand.bannerImages) {
            targetIndex = brand.bannerImages.indexOf(bannerImageUrl);
        } else if (indexRaw !== null) {
            targetIndex = Number(indexRaw);
        }

        if (
            targetIndex < 0 ||
            !brand.bannerImages ||
            targetIndex >= brand.bannerImages.length
        ) {
            return sendErrorResponse("Banner image not found", 404);
        }

        // Delete from ImageKit if fileId exists
        const fileIdToDelete = brand.bannerImageIds?.[targetIndex];
        if (fileIdToDelete) {
            try {
                await ImageKitService.deleteImage(fileIdToDelete);
            } catch (imgError) {
                console.error("Failed to delete image from ImageKit:", imgError);
            }
        }

        // Remove from arrays
        brand.bannerImages.splice(targetIndex, 1);
        if (brand.bannerImageIds) {
            brand.bannerImageIds.splice(targetIndex, 1);
        }

        await brand.save();

        return sendSuccessResponse("Banner image deleted successfully", {
            bannerImages: brand.bannerImages,
            bannerImageIds: brand.bannerImageIds,
        });
    } catch (error: any) {
        console.error("Error deleting banner image:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}