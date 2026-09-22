/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import "@/models/category.model";
import "@/models/mainCategory.model";
import "@/models/subCategory.model";
import "@/models/leafCategory.model";
import "@/models/brand.model";
import "@/models/store.model";
import "@/models/sellType.model";
import "@/models/tagLine.model";
import "@/models/paymentMethod.model";

import { connectDB } from "@/lib/mongodb";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import ProductModel from "@/models/product.model";


export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { mainCategoryId } = body;

        // 1. Validation
        if (mainCategoryId === undefined || mainCategoryId === null || typeof Number(mainCategoryId) !== "number" || isNaN(Number(mainCategoryId))) {
            return sendErrorResponse("Valid mainCategoryId is required", 200);
        }

        const parsedMainCategoryId = Number(mainCategoryId);

        // 2. Query MongoDB
        // Note: Use .find() if a mainCategoryId can belong to multiple products, or .findOne() if it's strictly a 1:1 relation.
        const products = await ProductModel.find({
            mainCategoryId: parsedMainCategoryId,
            isActive: true,
        })
            .populate("brandInfo")
            .populate("storeInfo")
            .populate("categoryInfo")
            .populate("mainCategoryInfo")
            .populate("subCategoryInfo")
            .populate("leafCategoryInfo")
            .populate("sellTypeInfo")
            .populate("tagLineInfo")
            .populate("paymentMethodsInfo")
            .lean();

        if (!products || products.length === 0) {
            return sendErrorResponse("Products not found for this categoryId", 200);
        }

        // 3. Return Success
        return sendSuccessResponse("Products fetched successfully", {
            products,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching products by mainCategoryId",
            200
        );
    }
}