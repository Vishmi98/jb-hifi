/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import PaymentMethodModel from "@/models/paymentMethod.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { page, limit } = body;

        let paymentMethods;
        const totalPaymentMethods = await PaymentMethodModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalPaymentMethods / limit);

            paymentMethods = await PaymentMethodModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean();

            return sendSuccessResponse("Payment methods fetched successfully", {
                page,
                limit,
                totalPages,
                totalPaymentMethods,
                paymentMethods,
            });
        }

        paymentMethods = await PaymentMethodModel.find()
            .sort({ createdAt: -1 })
            .lean();

        return sendSuccessResponse("All payment methods fetched successfully", {
            totalPaymentMethods,
            paymentMethods,
        });
    } catch (error: any) {
        console.error("Error fetching payment methods:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
