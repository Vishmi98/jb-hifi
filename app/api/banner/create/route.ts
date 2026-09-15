/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import BannerModel from "@/models/banner.model";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { bannerType } = body;

        if (!bannerType.trim()) {
            return sendErrorResponse("Banner type required", 200);
        }

        const lastType = await BannerModel.findOne().sort({ id: -1 });
        const nextId = lastType ? lastType.id + 1 : 1;

        const banner = await BannerModel.create({
            id: nextId,
            bannerType: bannerType.trim(),
        });

        await publishDataChange("banners");

        return sendSuccessResponse("Banner collection created successfully", { banner });
    } catch (error: any) {
        console.error("Error creating banner:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}