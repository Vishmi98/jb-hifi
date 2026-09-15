import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";
import { parseBool, parseJSON, parseNumber } from "@/utils/api.utils";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Extract ID
        const rawId = (formData.get("brandId") || formData.get("id")) as string;
        const brandId = Number(rawId);

        if (!rawId || isNaN(brandId)) {
            return sendErrorResponse("A valid brand ID is required", 400);
        }

        const brand = await BrandModel.findOne({ id: brandId });
        if (!brand) {
            return sendErrorResponse("Brand not found", 404);
        }

        // Extract uniqueness fields
        const name = (formData.get("name") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();

        // Check for unique name or slug conflict
        if (name || slug) {
            const conflictQuery = [];
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
            if (brand.logoId) {
                try {
                    await ImageKitService.deleteImage(brand.logoId);
                } catch (imgError) {
                    console.error("Failed to delete old logo from ImageKit:", imgError);
                }
            }

            const buffer = Buffer.from(await logo.arrayBuffer());
            const filename = `${Date.now()}-${logo.name}`;
            const uploaded = await ImageKitService.uploadImage(buffer, filename, "jb_hifi/brand");

            brand.logo = uploaded.url;
            brand.logoId = uploaded.fileId;
        }

        // Basic Fields Updates
        if (name) brand.name = name;
        if (slug) brand.slug = slug;

        const shortDescription = formData.get("shortDescription");
        if (shortDescription !== null) brand.shortDescription = shortDescription as string;

        const videoLink = formData.get("videoLink");
        if (videoLink !== null) brand.videoLink = videoLink as string;

        // Category Fields Updates
        if (formData.has("categoryId")) brand.categoryId = parseNumber(formData.get("categoryId"), brand.categoryId);
        if (formData.has("mainCategoryId")) brand.mainCategoryId = parseNumber(formData.get("mainCategoryId"), brand.mainCategoryId);
        if (formData.has("subCategoryId")) brand.subCategoryId = parseNumber(formData.get("subCategoryId"), brand.subCategoryId);
        if (formData.has("leafCategoryId")) brand.leafCategoryId = parseNumber(formData.get("leafCategoryId"), brand.leafCategoryId);

        // Status & Toggle Fields Updates
        if (formData.has("isFeatured")) brand.isFeatured = parseBool(formData.get("isFeatured"), brand.isFeatured);
        if (formData.has("isActive")) brand.isActive = parseBool(formData.get("isActive"), brand.isActive);
        if (formData.has("haveSinglePage")) brand.haveSinglePage = parseBool(formData.get("haveSinglePage"), brand.haveSinglePage);

        // Complex Objects Updates
        if (formData.has("collections")) brand.collections = parseJSON(formData.get("collections"), brand.collections);
        if (formData.has("bannerImages")) brand.bannerImages = parseJSON(formData.get("bannerImages"), brand.bannerImages);
        if (formData.has("bannerImageIds")) brand.bannerImageIds = parseJSON(formData.get("bannerImageIds"), brand.bannerImageIds);

        await brand.save();
        await publishDataChange("brands");

        return sendSuccessResponse("Brand updated successfully", { brand });
    } catch (error: unknown) {
        console.error("Error updating brand:", error);
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        return sendErrorResponse(errorMessage, 500);
    }
}