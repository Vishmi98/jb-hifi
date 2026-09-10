/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import BrandModel from "@/models/brand.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Brand ID is required", 200);
        }

        const brand = await BrandModel.findOneAndDelete({ id: Number(id) });

        if (!brand) {
            return sendErrorResponse("Brand not found", 200);
        }

        return sendSuccessResponse("Brand deleted successfully", { brand });
    } catch (error: any) {
        console.error("Error deleting brand:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
