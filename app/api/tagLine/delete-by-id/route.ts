/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import TagLineModel from "@/models/tagLine.model";
import { publishDataChange } from "@/services/realtime";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { id } = await req.json();

        if (id === undefined || id === null || Number.isNaN(Number(id))) {
            return sendErrorResponse("Valid tag line ID is required", 200);
        }

        const deletedTagLine = await TagLineModel.findOneAndDelete({ id: Number(id) });
        if (!deletedTagLine) return sendErrorResponse("Tag line not found", 200);

        await publishDataChange("tagLines");

        return sendSuccessResponse("Tag line deleted successfully", { tagLine: deletedTagLine });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
