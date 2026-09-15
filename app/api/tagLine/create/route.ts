/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import TagLineModel from "@/models/tagLine.model";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name } = body;

        if (!name || !name.trim()) {
            return sendErrorResponse("Name required", 200);
        }

        const lastTagLine = await TagLineModel.findOne().sort({ id: -1 });
        const nextId = lastTagLine ? lastTagLine.id + 1 : 1;

        const tagLine = await TagLineModel.create({
            id: nextId,
            name: name.trim(),
        });

        await publishDataChange("tagLines");

        return sendSuccessResponse("Tag line created successfully", { tagLine });
    } catch (error: any) {
        console.error("Error creating tagLine:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
