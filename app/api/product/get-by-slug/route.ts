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

const slugify = (text?: string) => {
    if (!text) return "";
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/\-\-+/g, "-");
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json().catch(() => ({}));
        const { slug: rawSlug } = body;

        if (!rawSlug || typeof rawSlug !== "string") {
            return sendErrorResponse("Slug is required", 400);
        }

        const cleanSlug = rawSlug.trim().toLowerCase();

        // 1. Fetch active products whose base slug matches or forms a prefix of the URL slug
        const candidateProducts = await ProductModel.find({
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

        // 2. Find product where base slug matches the start of cleanSlug
        const product: any = candidateProducts.find((p: any) =>
            cleanSlug.startsWith(p.slug.toLowerCase())
        );

        if (!product) {
            return sendErrorResponse("Product not found", 404);
        }

        // 3. Match the specific variant based on compound slug attributes (storage/color)
        let selectedVariant = product.variants?.[0] || null;

        if (Array.isArray(product.variants) && product.variants.length > 0) {
            const matchedVariant = product.variants.find((v: any) => {
                const storageSpec = v.specifications?.find(
                    (s: any) =>
                        s.name.toLowerCase() === "internal storage" ||
                        s.name.toLowerCase() === "storage"
                )?.value;

                const storageSlug = slugify(storageSpec);
                const colorSlug = slugify(v.color);

                const constructedSlug = [product.slug, storageSlug, colorSlug]
                    .filter(Boolean)
                    .join("-")
                    .toLowerCase();

                return constructedSlug === cleanSlug;
            });

            if (matchedVariant) {
                selectedVariant = matchedVariant;
            }
        }

        return sendSuccessResponse("Product fetched successfully", {
            product,
            selectedVariant,
        });
    } catch (error: any) {
        return sendErrorResponse(
            error?.message || "Unexpected error occurred while fetching product",
            500
        );
    }
}