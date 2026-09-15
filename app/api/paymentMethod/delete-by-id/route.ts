/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import PaymentMethodModel from "@/models/paymentMethod.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { publishDataChange } from "@/services/realtime";

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { id } = body;

        if (!id) {
            return sendErrorResponse("Payment method ID is required", 400);
        }

        const paymentMethod = await PaymentMethodModel.findOneAndDelete({
            id: Number(id),
        });

        if (!paymentMethod) {
            return sendErrorResponse("Payment method not found", 404);
        }

        await publishDataChange("paymentMethods");

        return sendSuccessResponse("Payment method deleted successfully", {
            paymentMethod,
        });
    } catch (error: any) {
        console.error("Error deleting payment method:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
