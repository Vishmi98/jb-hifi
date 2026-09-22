/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import ProductModel, { IProductVariant } from "@/models/product.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";
import { parseJSON, parseNumber } from "@/utils/api.utils";

const MAX_VARIANTS_COUNT = 10;

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Safe cleanup for legacy unique index on nested array elements
        try {
            await ProductModel.collection.dropIndex("variants.id_1");
        } catch {
            // Index already dropped or doesn't exist
        }

        const formData = await req.formData();

        // 1. Retrieve product identifier
        const productIdRaw = formData.get("productId") as string;
        if (!productIdRaw) {
            return sendErrorResponse("productId is required", 400);
        }

        const parsedId = parseNumber(productIdRaw, NaN);
        const query = !isNaN(parsedId) ? { id: parsedId } : { _id: productIdRaw };

        // 2. Locate targeted product
        const product = await ProductModel.findOne(query);
        if (!product) {
            return sendErrorResponse("Product not found", 404);
        }

        const currentVariants = product.variants || [];
        const currentVariantCount = currentVariants.length;

        if (currentVariantCount >= MAX_VARIANTS_COUNT) {
            return sendErrorResponse(
                `Product already reached the maximum limit of ${MAX_VARIANTS_COUNT} variants`,
                400
            );
        }

        // 3. Extract raw variants from JSON or single Form fields
        let rawVariants: Record<string, any>[] = [];
        const variantsJsonStr = formData.get("variants") as string;

        if (variantsJsonStr) {
            const parsed = parseJSON(variantsJsonStr, null);
            if (Array.isArray(parsed)) {
                rawVariants = parsed;
            } else if (parsed && typeof parsed === "object") {
                rawVariants = [parsed];
            }
        } else {
            rawVariants.push({
                productModel: formData.get("productModel"),
                sku: formData.get("sku"),
                price: formData.get("price"),
                originalPrice: formData.get("originalPrice"),
                additionalPrice: formData.get("additionalPrice"),
                stockCount: formData.get("stockCount"),
                color: formData.get("color"),
                colorHexCode: formData.get("colorHexCode"),
                specifications: parseJSON(formData.get("specifications"), []),
            });
        }

        if (!rawVariants.length) {
            return sendErrorResponse("At least one variant object is required", 400);
        }

        if (currentVariantCount + rawVariants.length > MAX_VARIANTS_COUNT) {
            const availableSlots = MAX_VARIANTS_COUNT - currentVariantCount;
            return sendErrorResponse(
                `Product has ${currentVariantCount} variants. You can only add ${availableSlots} more (Maximum limit is ${MAX_VARIANTS_COUNT}).`,
                400
            );
        }

        // Track used IDs dynamically across existing and newly assigned variants
        const usedIds = new Set<number>(
            currentVariants
                .map((v: any) => parseNumber(v.id, NaN))
                .filter((id: number) => !isNaN(id))
        );

        let currentMaxId = usedIds.size > 0 ? Math.max(...Array.from(usedIds)) : 0;

        // 4. Process images & map strict typed variants
        const variantImageFiles = formData.getAll("variantImages") as File[];

        const newVariants: IProductVariant[] = await Promise.all(
            rawVariants.map(async (variant, idx) => {
                const indexedFile = formData.get(`variantImage_${idx}`) as File | null;
                const fileToUpload = indexedFile || variantImageFiles[idx] || null;

                let imagePath = (variant.imagePath as string) || "";
                let imagePathId = (variant.imagePathId as string) || "";

                if (fileToUpload && fileToUpload.size > 0) {
                    const buffer = Buffer.from(await fileToUpload.arrayBuffer());
                    const filename = `${Date.now()}-variant-${fileToUpload.name.replace(/\s+/g, "_")}`;

                    const uploaded = await ImageKitService.uploadImage(
                        buffer,
                        filename,
                        "jb_hifi/products/variants"
                    );

                    imagePath = uploaded.url;
                    imagePathId = uploaded.fileId;
                }

                const parsedPrice = parseNumber(variant.price, 0);
                const parsedOriginalPrice = parseNumber(variant.originalPrice, parsedPrice);
                const parsedAdditionalPrice = parseNumber(variant.additionalPrice, 0);

                // Safely assign unique variant ID scoped to this product
                let assignedId = parseNumber(variant.id, NaN);
                if (isNaN(assignedId) || usedIds.has(assignedId)) {
                    currentMaxId += 1;
                    assignedId = currentMaxId;
                }
                usedIds.add(assignedId);

                return {
                    id: assignedId,
                    productModel: String(variant.productModel || "").trim(),
                    sku: String(variant.sku || "").trim(),
                    price: parsedPrice,
                    originalPrice: parsedOriginalPrice,
                    additionalPrice: parsedAdditionalPrice,
                    stockCount: parseNumber(variant.stockCount, 0),
                    color: String(variant.color || "").trim(),
                    colorHexCode: String(variant.colorHexCode || "").trim(),
                    specifications: Array.isArray(variant.specifications) ? variant.specifications : [],
                    imagePath,
                    imagePathId,
                } as IProductVariant;
            })
        );

        // 5. Append variants into document array
        const updatedProduct = await ProductModel.findOneAndUpdate(
            query,
            {
                $push: {
                    variants: { $each: newVariants },
                },
            },
            { returnDocument: "after", runValidators: true }
        );

        await publishDataChange("products");

        return sendSuccessResponse("Product variants added successfully", {
            product: updatedProduct,
            addedCount: newVariants.length,
        });
    } catch (error: any) {
        console.error("Error adding product variants:", error);
        return sendErrorResponse(error?.message || "Unexpected error occurred", 500);
    }
}