/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import LeafCategoryModel from "@/models/leafCategory.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const leafCategoryId = formData.get("id") as string | null;

        if (!leafCategoryId) {
            return sendErrorResponse("Leaf category ID is required for update", 400);
        }

        const existingLeafCategory = await LeafCategoryModel.findOne({ id: Number(leafCategoryId) });

        if (!existingLeafCategory) {
            return sendErrorResponse("Leaf category not found", 404);
        }

        const categoryId = formData.get("categoryId") !== null
            ? Number(formData.get("categoryId"))
            : existingLeafCategory.categoryId;

        const mainCategoryId = formData.get("mainCategoryId") !== null
            ? Number(formData.get("mainCategoryId"))
            : existingLeafCategory.mainCategoryId;

        const subCategoryId = formData.get("subCategoryId") !== null
            ? Number(formData.get("subCategoryId"))
            : existingLeafCategory.subCategoryId;

        const name = (formData.get("name") as string | null)?.trim() || existingLeafCategory.name;
        const leafSlug = (formData.get("leafSlug") as string | null)?.trim() || existingLeafCategory.leafSlug;
        const description =
            formData.get("description") !== null
                ? ((formData.get("description") as string) || "")
                : existingLeafCategory.description;
        const isActive = formData.has("isActive")
            ? formData.get("isActive") === "true"
            : existingLeafCategory.isActive;

        if (!Number.isInteger(categoryId) || categoryId < 1) {
            return sendErrorResponse("A valid categoryId is required", 400);
        }

        if (!Number.isInteger(mainCategoryId) || mainCategoryId < 1) {
            return sendErrorResponse("A valid mainCategoryId is required", 400);
        }

        if (!Number.isInteger(subCategoryId) || subCategoryId < 1) {
            return sendErrorResponse("A valid subCategoryId is required", 400);
        }

        const duplicateCheck = await LeafCategoryModel.findOne({
            _id: { $ne: existingLeafCategory._id },
            $or: [{ name }, { leafSlug }],
        });

        if (duplicateCheck) {
            return sendErrorResponse("Leaf category name or leafSlug is already in use by another leaf category", 400);
        }

        let imagePath = existingLeafCategory.imagePath || "";
        let imageId = existingLeafCategory.imageId || "";
        const newImage = formData.get("image") as File | null;

        if (newImage && newImage.size > 0) {
            if (existingLeafCategory.imageId) {
                await ImageKitService.deleteImage(existingLeafCategory.imageId).catch(() => null);
            }

            const buffer = Buffer.from(await newImage.arrayBuffer());
            const filename = `${Date.now()}-${newImage.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/leafCategory"
            );

            imagePath = uploaded.url;
            imageId = uploaded.fileId;
        }

        const updatedLeafCategory = await LeafCategoryModel.findOneAndUpdate(
            { id: Number(leafCategoryId) },
            {
                categoryId,
                mainCategoryId,
                subCategoryId,
                name,
                leafSlug,
                description,
                imagePath,
                imageId,
                isActive,
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("leafCategories");

        return sendSuccessResponse("Leaf category updated successfully", { leafCategory: updatedLeafCategory });
    } catch (error: any) {
        console.error("Error updating leaf category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
