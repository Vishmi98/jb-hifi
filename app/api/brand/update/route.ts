// app/api/brand/update/route.ts
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

        // Extract ID from FormData
        const rawId = (formData.get("brandId") || formData.get("id")) as string;
        const brandId = Number(rawId);

        if (!rawId || isNaN(brandId)) {
            return sendErrorResponse("A valid brand ID is required", 400);
        }

        const brand = await BrandModel.findOne({ id: brandId });
        if (!brand) {
            return sendErrorResponse("Brand not found", 404);
        }

        // Extract fields
        const name = (formData.get("name") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();
        const shortDescription = formData.get("shortDescription") as string | null;
        const videoLink = formData.get("videoLink") as string | null;

        // Check for unique name or slug conflict if they are being changed
        if (name || slug) {
            const conflictQuery: any[] = [];
            if (name && name !== brand.name) conflictQuery.push({ name });
            if (slug && slug !== brand.slug) conflictQuery.push({ slug });

            if (conflictQuery.length > 0) {
                const existingBrand = await BrandModel.findOne({
                    id: { $ne: brandId },
                    $or: conflictQuery,
                });

                if (existingBrand) {
                    return sendErrorResponse("Another brand with this name or slug already exists", 400);
                }
            }
        }

        // Handle Logo Replacement
        const logo = formData.get("logo") as File | null;
        if (logo && logo.size > 0) {
            // Delete old logo from ImageKit if it exists
            if (brand.logoId) {
                try {
                    await ImageKitService.deleteImage(brand.logoId);
                } catch (imgError) {
                    console.error("Failed to delete old logo from ImageKit:", imgError);
                }
            }

            // Upload new logo
            const buffer = Buffer.from(await logo.arrayBuffer());
            const filename = `${Date.now()}-${logo.name}`;
            const uploaded = await ImageKitService.uploadImage(buffer, filename, "jb_hifi/brand");

            brand.logo = uploaded.url;
            brand.logoId = uploaded.fileId;
        }

        // Update fields if provided
        if (name) brand.name = name;
        if (slug) brand.slug = slug;
        if (shortDescription !== null) brand.shortDescription = shortDescription;
        if (videoLink !== null) brand.videoLink = videoLink;

        await brand.save();

        return sendSuccessResponse("Brand updated successfully", { brand });
    } catch (error: any) {
        console.error("Error updating brand:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}