/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SellTypeModel from "@/models/sellType.model";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (id === undefined || id === null || Number.isNaN(Number(id))) {
            return sendErrorResponse("Valid sell type ID is required", 200);
        }

        const deletedSellType = await SellTypeModel.findOneAndDelete({ id: Number(id) });
        if (!deletedSellType) return sendErrorResponse("Sell type not found", 200);

        return sendSuccessResponse("Sell type deleted successfully", { sellType: deletedSellType });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}