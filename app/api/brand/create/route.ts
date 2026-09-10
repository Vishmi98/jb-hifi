// app/api/brands/route.ts
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
        const name = (formData.get("name") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();
        const shortDescription = (formData.get("shortDescription") as string) || "";
        const videoLink = (formData.get("videoLink") as string) || "";
        const isFeatured = formData.get("isFeatured") === "true";
        const isActive = formData.get("isActive") !== "false";

        if (!name || !slug) {
            return sendErrorResponse("Name and slug are required", 400);
        }

        const existingBrand = await BrandModel.findOne({ $or: [{ name }, { slug }] });
        if (existingBrand) {
            return sendErrorResponse("Brand name or slug already exists", 400);
        }

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

        const lastItem = await BrandModel.findOne().sort({ id: -1 });
        const nextId = lastItem ? lastItem.id + 1 : 1;

        const brand = await BrandModel.create({
            id: nextId,
            name,
            slug,
            logo: logoPath,
            logoId,
            shortDescription,
            videoLink,
            isFeatured,
            isActive,
        });

        return sendSuccessResponse("Brand Created Successfully", { brand });
    } catch (error: any) {
        console.error("Error creating brand:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}