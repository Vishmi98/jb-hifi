/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/category.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const categoryId = formData.get("id") as string | null;

        if (!categoryId) {
            return sendErrorResponse("Category ID is required for update", 400);
        }

        const existingCategory = await CategoryModel.findOne({ id: Number(categoryId) });

        if (!existingCategory) {
            return sendErrorResponse("Category not found", 404);
        }

        const name = (formData.get("name") as string | null)?.trim() || existingCategory.name;
        const slug = (formData.get("slug") as string | null)?.trim() || existingCategory.slug;
        const description =
            formData.get("description") !== null
                ? ((formData.get("description") as string) || "")
                : existingCategory.description;
        const isActive = formData.has("isActive")
            ? formData.get("isActive") === "true"
            : existingCategory.isActive;

        const duplicateCheck = await CategoryModel.findOne({
            _id: { $ne: existingCategory._id },
            $or: [{ name }, { slug }],
        });

        if (duplicateCheck) {
            return sendErrorResponse("Category name or slug is already in use by another category", 400);
        }

        let imagePath = existingCategory.imagePath || "";
        let imageId = existingCategory.imageId || "";
        const newImage = formData.get("image") as File | null;

        if (newImage && newImage.size > 0) {
            if (existingCategory.imageId) {
                await ImageKitService.deleteImage(existingCategory.imageId).catch(() => null);
            }

            const buffer = Buffer.from(await newImage.arrayBuffer());
            const filename = `${Date.now()}-${newImage.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/category"
            );

            imagePath = uploaded.url;
            imageId = uploaded.fileId;
        }

        const updatedCategory = await CategoryModel.findOneAndUpdate(
            { id: Number(categoryId) },
            {
                name,
                slug,
                description,
                imagePath,
                imageId,
                isActive,
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("categories");

        return sendSuccessResponse("Category Updated Successfully", { category: updatedCategory });
    } catch (error: any) {
        console.error("Error updating category:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
