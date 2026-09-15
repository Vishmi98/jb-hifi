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

        // Required Fields
        const name = (formData.get("name") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();

        if (!name || !slug) {
            return sendErrorResponse("Name and slug are required", 400);
        }

        // Check for existing brand
        const existingBrand = await BrandModel.findOne({ $or: [{ name }, { slug }] });
        if (existingBrand) {
            return sendErrorResponse("Brand name or slug already exists", 400);
        }

        // Handle Logo Upload
        let logoPath = "";
        let logoId = "";
        const logo = formData.get("logo") as File | null;

        if (logo && logo.size > 0) {
            const buffer = Buffer.from(await logo.arrayBuffer());
            const filename = `${Date.now()}-${logo.name}`;
            const uploaded = await ImageKitService.uploadImage(buffer, filename, "jb_hifi/brand");
            logoPath = uploaded.url;
            logoId = uploaded.fileId;
        }

        // Generate Auto-Increment ID
        const lastItem = await BrandModel.findOne().sort({ id: -1 }).lean();
        const nextId = lastItem ? lastItem.id + 1 : 1;

        // Build Payload (Mapping all fields appropriately)
        const brand = await BrandModel.create({
            id: nextId,
            name,
            slug,
            logo: logoPath,
            logoId,
            shortDescription: (formData.get("shortDescription") as string) || "",
            videoLink: (formData.get("videoLink") as string) || "",
            isFeatured: parseBool(formData.get("isFeatured"), false),
            isActive: parseBool(formData.get("isActive"), true),
            haveSinglePage: parseBool(formData.get("haveSinglePage"), true),

            // Categories
            categoryId: parseNumber(formData.get("categoryId"), 0),
            mainCategoryId: parseNumber(formData.get("mainCategoryId"), 0),
            subCategoryId: parseNumber(formData.get("subCategoryId"), 0),
            leafCategoryId: parseNumber(formData.get("leafCategoryId"), 0),

            // Complex Objects
            collections: parseJSON(formData.get("collections"), []),
            bannerImages: parseJSON(formData.get("bannerImages"), []),
            bannerImageIds: parseJSON(formData.get("bannerImageIds"), []),
        });

        await publishDataChange("brands");

        return sendSuccessResponse("Brand Created Successfully", { brand });
    } catch (error: unknown) {
        console.error("Error creating brand:", error);
        const errorMessage = error instanceof Error ? error.message : "Unexpected error";
        return sendErrorResponse(errorMessage, 500);
    }
}