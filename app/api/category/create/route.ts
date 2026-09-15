/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { ImageKitService } from "@/services/imagekit";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";
import CategoryModel from "@/models/category.model";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = (formData.get("name") as string | null)?.trim();
    const slug = (formData.get("slug") as string | null)?.trim();
    const description = (formData.get("description") as string | null)?.trim() || "";
    const isActive = formData.has("isActive") ? formData.get("isActive") === "true" : true;
    const image = formData.get("image") as File | null;

    if (!name || !slug) {
      return sendErrorResponse("Name and slug are required", 200);
    }

    if (!description) {
      return sendErrorResponse("Description is required", 200);
    }

    const existingCategory = await CategoryModel.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return sendErrorResponse("Category name or slug already exists", 200);
    }

    let imagePath = "";
    let imageId = "";

    if (image && image.size > 0) {
      const buffer = Buffer.from(await image.arrayBuffer());
      const filename = `${Date.now()}-${image.name}`;
      const uploaded = await ImageKitService.uploadImage(
        buffer,
        filename,
        "jb_hifi/category"
      );
      imagePath = uploaded.url;
      imageId = uploaded.fileId;
    }

    const lastItem = await CategoryModel.findOne().sort({ id: -1 });
    const nextId = lastItem ? lastItem.id + 1 : 1;

    const category = await CategoryModel.create({
      id: nextId,
      name,
      description,
      slug,
      imagePath,
      imageId,
      isActive,
    });

    await publishDataChange("categories");

    return sendSuccessResponse("Category Created Successfully", { category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return sendErrorResponse(error?.message || "Unexpected error", 200);
  }
}