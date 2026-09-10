/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import MainCategoryModel from "@/models/mainCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const mainCategoryId = formData.get("id") as string | null;

        if (!mainCategoryId) {
            return sendErrorResponse("Main category ID is required for update", 400);
        }

        const existingMainCategory = await MainCategoryModel.findOne({ id: Number(mainCategoryId) });

        if (!existingMainCategory) {
            return sendErrorResponse("Main category not found", 404);
        }

        const categoryId = formData.get("categoryId") !== null
            ? Number(formData.get("categoryId"))
            : existingMainCategory.categoryId;

        const name = (formData.get("name") as string | null)?.trim() || existingMainCategory.name;
        const mainSlug = (formData.get("mainSlug") as string | null)?.trim() || existingMainCategory.mainSlug;
        const description =
            formData.get("description") !== null
                ? ((formData.get("description") as string) || "")
                : existingMainCategory.description;
        const isActive = formData.has("isActive")
            ? formData.get("isActive") === "true"
            : existingMainCategory.isActive;

        if (!Number.isInteger(categoryId) || categoryId < 1) {
            return sendErrorResponse("A valid categoryId is required", 400);
        }

        const duplicateCheck = await MainCategoryModel.findOne({
            _id: { $ne: existingMainCategory._id },
            $or: [{ name }, { mainSlug }],
        });

        if (duplicateCheck) {
            return sendErrorResponse("Main category name or mainSlug is already in use by another main category", 400);
        }

        let imagePath = existingMainCategory.imagePath || "";
        let imageId = existingMainCategory.imageId || "";
        const newImage = formData.get("image") as File | null;

        if (newImage && newImage.size > 0) {
            if (existingMainCategory.imageId) {
                await ImageKitService.deleteImage(existingMainCategory.imageId).catch(() => null);
            }

            const buffer = Buffer.from(await newImage.arrayBuffer());
            const filename = `${Date.now()}-${newImage.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/mainCategory"
            );

            imagePath = uploaded.url;
            imageId = uploaded.fileId;
        }

        const updatedMainCategory = await MainCategoryModel.findOneAndUpdate(
            { id: Number(mainCategoryId) },
            {
                categoryId,
                name,
                mainSlug,
                description,
                imagePath,
                imageId,
                isActive,
            },
            { new: true, runValidators: true }
        );

        return sendSuccessResponse("Main category updated successfully", { mainCategory: updatedMainCategory });
    } catch (error: any) {
        console.error("Error updating main category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
