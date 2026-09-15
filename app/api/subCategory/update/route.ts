/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import SubCategoryModel from "@/models/subCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const subCategoryId = formData.get("id") as string | null;

        if (!subCategoryId) {
            return sendErrorResponse("Sub category ID is required for update", 400);
        }

        const existingSubCategory = await SubCategoryModel.findOne({ id: Number(subCategoryId) });

        if (!existingSubCategory) {
            return sendErrorResponse("Sub category not found", 404);
        }

        const categoryId = formData.get("categoryId") !== null
            ? Number(formData.get("categoryId"))
            : existingSubCategory.categoryId;

        const mainCategoryId = formData.get("mainCategoryId") !== null
            ? Number(formData.get("mainCategoryId"))
            : existingSubCategory.mainCategoryId;

        const name = (formData.get("name") as string | null)?.trim() || existingSubCategory.name;
        const subSlug = (formData.get("subSlug") as string | null)?.trim() || existingSubCategory.subSlug;
        const description =
            formData.get("description") !== null
                ? ((formData.get("description") as string) || "")
                : existingSubCategory.description;
        const isActive = formData.has("isActive")
            ? formData.get("isActive") === "true"
            : existingSubCategory.isActive;

        if (!Number.isInteger(categoryId) || categoryId < 1) {
            return sendErrorResponse("A valid categoryId is required", 400);
        }

        if (!Number.isInteger(mainCategoryId) || mainCategoryId < 1) {
            return sendErrorResponse("A valid mainCategoryId is required", 400);
        }

        const duplicateCheck = await SubCategoryModel.findOne({
            _id: { $ne: existingSubCategory._id },
            $or: [{ name }, { subSlug }],
        });

        if (duplicateCheck) {
            return sendErrorResponse("Sub category name or subSlug is already in use by another sub category", 400);
        }

        let imagePath = existingSubCategory.imagePath || "";
        let imageId = existingSubCategory.imageId || "";
        const newImage = formData.get("image") as File | null;

        if (newImage && newImage.size > 0) {
            if (existingSubCategory.imageId) {
                await ImageKitService.deleteImage(existingSubCategory.imageId).catch(() => null);
            }

            const buffer = Buffer.from(await newImage.arrayBuffer());
            const filename = `${Date.now()}-${newImage.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/subCategory"
            );

            imagePath = uploaded.url;
            imageId = uploaded.fileId;
        }

        const updatedSubCategory = await SubCategoryModel.findOneAndUpdate(
            { id: Number(subCategoryId) },
            {
                categoryId,
                mainCategoryId,
                name,
                subSlug,
                description,
                imagePath,
                imageId,
                isActive,
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("subCategories");

        return sendSuccessResponse("Sub category updated successfully", { subCategory: updatedSubCategory });
    } catch (error: any) {
        console.error("Error updating sub category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
