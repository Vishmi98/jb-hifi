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
    const categoryId = Number(formData.get("categoryId"));
    const name = (formData.get("name") as string | null)?.trim();
    const mainSlug = (formData.get("mainSlug") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() || "";
    const isActive = formData.has("isActive") ? formData.get("isActive") === "true" : true;
    const image = formData.get("image") as File | null;

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return sendErrorResponse("A valid categoryId is required", 200);
    }

    if (!name || !mainSlug) {
      return sendErrorResponse("Name and mainSlug are required", 200);
    }

    const existingMainCategory = await MainCategoryModel.findOne({
      $or: [{ name }, { mainSlug }],
    });

    if (existingMainCategory) {
      return sendErrorResponse("Main category name or mainSlug already exists", 200);
    }

    let imageUrl = "";
    let imageId = "";

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const uploaded = await ImageKitService.uploadImage(
        buffer,
        filename,
        "jb_hifi/mainCategory"
      );
      imageUrl = uploaded.url;
      imageId = uploaded.fileId;
    }

    const lastItem = await MainCategoryModel.findOne().sort({ id: -1 });
    const nextId = lastItem ? lastItem.id + 1 : 1;

    const mainCategory = await MainCategoryModel.create({
      id: nextId,
      categoryId,
      name,
      description,
      mainSlug,
      imagePath: imageUrl,
      imageId,
      isActive,
    });

    return sendSuccessResponse("Main category created successfully", { mainCategory });
  } catch (error: any) {
    console.error("Error creating main category:", error);
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}
