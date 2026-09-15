// app/api/brand/delete-collection/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandModel, { ICollection } from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const rawId = (formData.get("brandId") || formData.get("id")) as string;
        const brandId = Number(rawId);

        if (!rawId || isNaN(brandId)) {
            return sendErrorResponse("A valid brand ID is required", 400);
        }

        const collectionId = formData.get("collectionId") as string | null; // MongoDB _id
        const imagePathId = formData.get("imagePathId") as string | null;
        const indexRaw = formData.get("index") as string | null;

        if (!collectionId && !imagePathId && indexRaw === null) {
            return sendErrorResponse("Provide collectionId, imagePathId, or index to delete", 400);
        }

        const brand = await BrandModel.findOne({ id: brandId });
        if (!brand || !brand.collections) {
            return sendErrorResponse("Brand or collections not found", 404);
        }

        let targetIndex = -1;

        if (collectionId) {
            targetIndex = brand.collections.findIndex(
                (col: ICollection & { _id?: any }) => col._id?.toString() === collectionId
            );
        } else if (imagePathId) {
            targetIndex = brand.collections.findIndex(
                (col: ICollection) => col.imagePathId === imagePathId
            );
        } else if (indexRaw !== null) {
            targetIndex = Number(indexRaw);
        }

        if (targetIndex < 0 || targetIndex >= brand.collections.length) {
            return sendErrorResponse("Collection item not found", 404);
        }

        // Delete associated image from ImageKit if present
        const fileIdToDelete = brand.collections[targetIndex]?.imagePathId;
        if (fileIdToDelete) {
            try {
                await ImageKitService.deleteImage(fileIdToDelete);
            } catch (imgError) {
                console.error("Failed to delete collection image from ImageKit:", imgError);
            }
        }

        // Remove collection item
        brand.collections.splice(targetIndex, 1);
        await brand.save();

        await publishDataChange("brandCollections");

        return sendSuccessResponse("Collection deleted successfully", {
            collections: brand.collections,
        });
    } catch (error: any) {
        console.error("Error deleting collection:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}