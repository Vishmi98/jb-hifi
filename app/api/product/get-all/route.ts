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
        const { page, limit } = body;

        let products;
        const totalProducts = await ProductModel.countDocuments();

        if (page && limit) {
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(totalProducts / limit);

            products = await ProductModel.find()
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
                .limit(limit)
                .lean();

            return sendSuccessResponse("Products fetched successfully", {
                page,
                limit,
                totalPages,
                totalProducts,
                products,
            });
        }

        products = await ProductModel.find({ isActive: true })
            .sort({ createdAt: 1 })
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

        return sendSuccessResponse("All products fetched successfully", {
            totalProducts,
            products,
        });
    } catch (error: any) {
        return sendErrorResponse(error?.message || "Unexpected error", 200);
    }
}