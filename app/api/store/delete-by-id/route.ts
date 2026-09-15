/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StoreModel from "@/models/store.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Store ID is required", 400);
        }

        const store = await StoreModel.findOneAndDelete({ id: Number(id) });

        if (!store) {
            return sendErrorResponse("Store not found", 404);
        }

        await publishDataChange("stores");

        return sendSuccessResponse("Store deleted successfully", { store });
    } catch (error: any) {
        console.error("Error deleting store:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
