/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BannerModel, { IItem } from "@/models/banner.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { bannerId, itemId } = body;

        // 1. Validate incoming parameters
        const parsedBannerId = Number(bannerId);
        const parsedItemId = Number(itemId);

        if (
            bannerId === undefined ||
            bannerId === null ||
            Number.isNaN(parsedBannerId) ||
            itemId === undefined ||
            itemId === null ||
            Number.isNaN(parsedItemId)
        ) {
            return sendErrorResponse("Valid bannerId and itemId are required", 200);
        }

        // 2. Fetch the target banner
        const banner = await BannerModel.findOne({ id: parsedBannerId });
        if (!banner) {
            return sendErrorResponse("Banner collection not found", 200);
        }

        // 3. Locate the item to delete inside the embedded items array
        const itemToDelete = banner.items.find((item: IItem) => item.id === parsedItemId);
        if (!itemToDelete) {
            return sendErrorResponse("Banner item not found", 200);
        }

        // 4. Delete the associated image from ImageKit if imageId exists
        if (itemToDelete.imageId) {
            try {
                await ImageKitService.deleteImage(itemToDelete.imageId);
            } catch (imageErr) {
                console.error("Failed to delete image from ImageKit:", imageErr);
                // Non-blocking: process continues so DB records remain synchronized
            }
        }

        // 5. Remove the item from array and update document
        banner.items = banner.items.filter((item: IItem) => item.id !== parsedItemId);
        await banner.save();

        // 6. Broadcast real-time change event
        await publishDataChange("bannerItems");

        return sendSuccessResponse("Banner item deleted successfully", {
            bannerId: parsedBannerId,
            deletedItemId: parsedItemId,
            remainingCount: banner.items.length,
        });
    } catch (error: any) {
        console.error("Error deleting banner item:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}