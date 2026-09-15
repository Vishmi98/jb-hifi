/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BannerModel from "@/models/banner.model";
import { publishDataChange } from "@/services/realtime";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (id === undefined || id === null || Number.isNaN(Number(id))) {
            return sendErrorResponse("Valid banner collection ID is required", 200);
        }

        const deletedBannerCollection = await BannerModel.findOneAndDelete({ id: Number(id) });
        if (!deletedBannerCollection) return sendErrorResponse("Banner collection not found", 200);

        await publishDataChange("banners");

        return sendSuccessResponse("Banner collection deleted successfully", { banner: deletedBannerCollection });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}