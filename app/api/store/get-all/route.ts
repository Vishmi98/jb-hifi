/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import { connectDB } from "@/lib/mongodb";
import StoreModel from "@/models/store.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;

        const totalStores = await StoreModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalStores / limit);

            const stores = await StoreModel.find()
                .populate("categoryInfo")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Stores fetched successfully", {
                page,
                limit,
                totalPages,
                totalStores,
                stores,
            });
        }

        const stores = await StoreModel.find({ isActive: true })
            .populate("categoryInfo")
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse("All stores fetched successfully", {
            totalStores,
            stores,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}
