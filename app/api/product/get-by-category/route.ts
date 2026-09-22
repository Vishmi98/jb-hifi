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
        const { categoryId, page, limit } = body;

        // 1. Validation: Ensure categoryId is provided and is a valid number
        if (categoryId === undefined || categoryId === null || isNaN(Number(categoryId))) {
            return sendErrorResponse("A valid 'categoryId' is required in the body.", 400);
        }

        const numericCategoryId = Number(categoryId);

        // 2. Query filter - check against active products with matching categoryId
        const filter = {
            categoryId: numericCategoryId,
            isActive: true,
        };

        const totalProducts = await ProductModel.countDocuments(filter);

        let products;

        // 3. Paginated query (if page & limit provided)
        if (page && limit) {
            const pageNum = Number(page);
            const limitNum = Number(limit);
            const skip = (pageNum - 1) * limitNum;
            const totalPages = Math.ceil(totalProducts / limitNum);

            products = await ProductModel.find(filter)
                .sort({ createdAt: -1 })
                .populate("brandInfo")
                .populate("storeInfo")
                .populate("categoryInfo")
                .populate("mainCategoryInfo")
                .populate("subCategoryInfo")
                .populate("leafCategoryInfo")
                .populate("sellTypeInfo")
                .populate("tagLineInfo")
                .populate("paymentMethodsInfo")
                .skip(skip)
                .limit(limitNum)
                .lean();

            return sendSuccessResponse("Products fetched successfully by category", {
                page: pageNum,
                limit: limitNum,
                totalPages,
                totalProducts,
                products,
            });
        }

        // 4. Default non-paginated query
        products = await ProductModel.find(filter)
            .sort({ createdAt: -1 })
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

        return sendSuccessResponse("Products fetched successfully by category", {
            totalProducts,
            products,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}