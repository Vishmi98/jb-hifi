/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import SellTypeModel from "@/models/sellType.model";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name } = body;

        if (!name.trim()) {
            return sendErrorResponse("Name required", 200);
        }

        const lastType = await SellTypeModel.findOne().sort({ id: -1 });
        const nextId = lastType ? lastType.id + 1 : 1;

        const sellType = await SellTypeModel.create({
            id: nextId,
            name: name.trim(),
        });

        return sendSuccessResponse("Sell type created successfully", { sellType });
    } catch (error: any) {
        console.error("Error creating sellType:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}