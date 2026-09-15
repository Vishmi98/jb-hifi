/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import PaymentMethodModel from "@/models/paymentMethod.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const name = (formData.get("name") as string)?.trim();
        const slug = (formData.get("slug") as string)?.trim();
        const isActive = formData.get("isActive") !== "false";

        const logoField = formData.get("logo");
        const logoId = (formData.get("logoId") as string)?.trim() || "";

        if (!name || !slug) {
            return sendErrorResponse("Name and slug are required", 400);
        }

        const existingPaymentMethod = await PaymentMethodModel.findOne({
            $or: [{ name }, { slug }],
        });

        if (existingPaymentMethod) {
            return sendErrorResponse("Payment method name or slug already exists", 400);
        }

        let logo = "";

        if (logoField instanceof File && logoField.size > 0) {
            const buffer = Buffer.from(await logoField.arrayBuffer());
            const filename = `${Date.now()}-${logoField.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/paymentMethod"
            );
            logo = uploaded.url;
        } else if (typeof logoField === "string" && logoField.trim()) {
            logo = logoField.trim();
        }

        const lastItem = await PaymentMethodModel.findOne().sort({ id: -1 });
        const nextId = lastItem ? lastItem.id + 1 : 1;

        const paymentMethodData: Record<string, any> = {
            id: nextId,
            name,
            slug,
            isActive,
        };

        if (logo) {
            paymentMethodData.logo = logo;
        }

        if (logoId) {
            paymentMethodData.logoId = logoId;
        }

        const paymentMethod = await PaymentMethodModel.create(paymentMethodData);

        await publishDataChange("paymentMethods");

        return sendSuccessResponse("Payment method created successfully", {
            paymentMethod,
        });
    } catch (error: any) {
        console.error("Error creating payment method:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}
