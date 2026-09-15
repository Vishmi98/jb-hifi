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
    const categoryId = Number(formData.get("categoryId"));
    const mainCategoryId = Number(formData.get("mainCategoryId"));
    const name = (formData.get("name") as string | null)?.trim();
    const subSlug = (formData.get("subSlug") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() || "";
    const isActive = formData.has("isActive") ? formData.get("isActive") === "true" : true;
    const image = formData.get("image") as File | null;

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return sendErrorResponse("A valid categoryId is required", 200);
    }

    if (!Number.isInteger(mainCategoryId) || mainCategoryId < 1) {
      return sendErrorResponse("A valid mainCategoryId is required", 200);
    }

    if (!name || !subSlug) {
      return sendErrorResponse("Name and subSlug are required", 200);
    }

    const existingSubCategory = await SubCategoryModel.findOne({
      $or: [{ name }, { subSlug }],
    });

    if (existingSubCategory) {
      return sendErrorResponse("Sub category name or subSlug already exists", 200);
    }

    let imageUrl = "";
    let imageId = "";

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const uploaded = await ImageKitService.uploadImage(
        buffer,
        filename,
        "jb_hifi/subCategory"
      );
      imageUrl = uploaded.url;
      imageId = uploaded.fileId;
    }

    const lastItem = await SubCategoryModel.findOne().sort({ id: -1 });
    const nextId = lastItem ? lastItem.id + 1 : 1;

    const subCategory = await SubCategoryModel.create({
      id: nextId,
      categoryId,
      mainCategoryId,
      name,
      description,
      subSlug,
      imagePath: imageUrl,
      imageId,
      isActive,
    });

    await publishDataChange("subCategories");

    return sendSuccessResponse("Sub category created successfully", { subCategory });
  } catch (error: any) {
    console.error("Error creating sub category:", error);
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}
