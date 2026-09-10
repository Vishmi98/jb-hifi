// app/api/brand/add-banners/route.ts
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

        const bannerFiles = formData.getAll("bannerImages") as File[];

        if (!bannerFiles || bannerFiles.length === 0) {
            return sendErrorResponse("No banner images provided", 400);
        }

        const currentBannerCount = brand.bannerImages?.length || 0;
        if (currentBannerCount + bannerFiles.length > 5) {
            return sendErrorResponse(
                `Maximum limit of 5 banner images exceeded. Current count: ${currentBannerCount}`,
                400
            );
        }

        const newBannerImages: string[] = [];
        const newBannerImageIds: string[] = [];

        for (const file of bannerFiles) {
            if (file && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `${Date.now()}-${file.name}`;
                const uploaded = await ImageKitService.uploadImage(
                    buffer,
                    filename,
                    "jb_hifi/brand/banners"
                );
                newBannerImages.push(uploaded.url);
                newBannerImageIds.push(uploaded.fileId);
            }
        }

        brand.bannerImages = [...(brand.bannerImages || []), ...newBannerImages];
        brand.bannerImageIds = [...(brand.bannerImageIds || []), ...newBannerImageIds];
        await brand.save();

        return sendSuccessResponse("Banner images uploaded successfully", {
            bannerImages: brand.bannerImages,
            bannerImageIds: brand.bannerImageIds,
        });
    } catch (error: any) {
        console.error("Error uploading banner images:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}