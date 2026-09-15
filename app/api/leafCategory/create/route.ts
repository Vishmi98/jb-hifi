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
    const categoryId = Number(formData.get("categoryId"));
    const mainCategoryId = Number(formData.get("mainCategoryId"));
    const subCategoryId = Number(formData.get("subCategoryId"));
    const name = (formData.get("name") as string | null)?.trim();
    const leafSlug = (formData.get("leafSlug") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() || "";
    const isActive = formData.has("isActive") ? formData.get("isActive") === "true" : true;
    const image = formData.get("image") as File | null;

    if (!Number.isInteger(categoryId) || categoryId < 1) {
      return sendErrorResponse("A valid categoryId is required", 200);
    }

    if (!Number.isInteger(mainCategoryId) || mainCategoryId < 1) {
      return sendErrorResponse("A valid mainCategoryId is required", 200);
    }

    if (!Number.isInteger(subCategoryId) || subCategoryId < 1) {
      return sendErrorResponse("A valid subCategoryId is required", 200);
    }

    if (!name || !leafSlug) {
      return sendErrorResponse("Name and leafSlug are required", 200);
    }

    const existingLeafCategory = await LeafCategoryModel.findOne({
      $or: [{ name }, { leafSlug }],
    });

    if (existingLeafCategory) {
      return sendErrorResponse("Leaf category name or leafSlug already exists", 200);
    }

    let imageUrl = "";
    let imageId = "";

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const uploaded = await ImageKitService.uploadImage(
        buffer,
        filename,
        "jb_hifi/leafCategory"
      );
      imageUrl = uploaded.url;
      imageId = uploaded.fileId;
    }

    const lastItem = await LeafCategoryModel.findOne().sort({ id: -1 });
    const nextId = lastItem ? lastItem.id + 1 : 1;

    const leafCategory = await LeafCategoryModel.create({
      id: nextId,
      categoryId,
      mainCategoryId,
      subCategoryId,
      name,
      description,
      leafSlug,
      imagePath: imageUrl,
      imageId,
      isActive,
    });

    await publishDataChange("leafCategories");

    return sendSuccessResponse("Leaf category created successfully", { leafCategory });
  } catch (error: any) {
    console.error("Error creating leaf category:", error);
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}
