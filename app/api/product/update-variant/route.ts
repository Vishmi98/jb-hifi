// app/api/product/update-variant/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";
import { parseJSON, parseNumber } from "@/utils/api.utils";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();

        // 1. Identify Target Product & Variant
        const productIdRaw = formData.get("productId") as string;
        const variantIdRaw = formData.get("variantId") as string;

        if (!productIdRaw || !variantIdRaw) {
            return sendErrorResponse("Both productId and variantId are required", 400);
        }

        const parsedProductId = parseNumber(productIdRaw, NaN);
        const parsedVariantId = parseNumber(variantIdRaw, NaN);

        if (isNaN(parsedVariantId)) {
            return sendErrorResponse("Valid numeric variantId is required", 400);
        }

        const productQuery = !isNaN(parsedProductId)
            ? { id: parsedProductId, "variants.id": parsedVariantId }
            : { _id: productIdRaw, "variants.id": parsedVariantId };

        // 2. Fetch existing product to locate the current variant state
        const existingProduct = await ProductModel.findOne(productQuery);
        if (!existingProduct) {
            return sendErrorResponse("Product or specified variant not found", 404);
        }

        const targetVariant = existingProduct.variants.find(
            (v) => v.id === parsedVariantId
        );

        if (!targetVariant) {
            return sendErrorResponse("Variant not found in product", 404);
        }

        // 3. Handle Optional Image Upload
        const variantImageFile = formData.get("variantImage") as File | null;
        let imagePath = targetVariant.imagePath;
        let imagePathId = targetVariant.imagePathId;

        if (variantImageFile && variantImageFile.size > 0) {
            const buffer = Buffer.from(await variantImageFile.arrayBuffer());
            const filename = `${Date.now()}-variant-${variantImageFile.name.replace(/\s+/g, "_")}`;

            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/products/variants"
            );

            imagePath = uploaded.url;
            imagePathId = uploaded.fileId;
        }

        // 4. Parse Updated Fields (fallback to targetVariant values if not provided)
        const productModel = formData.has("productModel")
            ? String(formData.get("productModel") || "").trim()
            : targetVariant.productModel;

        const sku = formData.has("sku")
            ? String(formData.get("sku") || "").trim()
            : targetVariant.sku;

        const price = formData.has("price")
            ? parseNumber(formData.get("price"), targetVariant.price)
            : targetVariant.price;

        const originalPrice = formData.has("originalPrice")
            ? parseNumber(formData.get("originalPrice"), targetVariant.originalPrice)
            : targetVariant.originalPrice;

        const additionalPrice = formData.has("additionalPrice")
            ? parseNumber(formData.get("additionalPrice"), targetVariant.additionalPrice)
            : targetVariant.additionalPrice;

        const stockCount = formData.has("stockCount")
            ? parseNumber(formData.get("stockCount"), targetVariant.stockCount)
            : targetVariant.stockCount;

        const color = formData.has("color")
            ? String(formData.get("color") || "").trim()
            : targetVariant.color;

        const colorHexCode = formData.has("colorHexCode")
            ? String(formData.get("colorHexCode") || "").trim()
            : targetVariant.colorHexCode;

        const specificationsRaw = formData.get("specifications");
        const specifications = specificationsRaw
            ? parseJSON(specificationsRaw as string, targetVariant.specifications)
            : targetVariant.specifications;

        // 5. Update the Subdocument via Positional Operator ($)
        const updatedProduct = await ProductModel.findOneAndUpdate(
            productQuery,
            {
                $set: {
                    "variants.$.productModel": productModel,
                    "variants.$.sku": sku,
                    "variants.$.price": price,
                    "variants.$.originalPrice": originalPrice,
                    "variants.$.additionalPrice": additionalPrice,
                    "variants.$.stockCount": stockCount,
                    "variants.$.color": color,
                    "variants.$.colorHexCode": colorHexCode,
                    "variants.$.specifications": specifications,
                    "variants.$.imagePath": imagePath,
                    "variants.$.imagePathId": imagePathId,
                },
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("products");

        return sendSuccessResponse("Product variant updated successfully", {
            product: updatedProduct,
        });
    } catch (error: any) {
        console.error("Error updating product variant:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}