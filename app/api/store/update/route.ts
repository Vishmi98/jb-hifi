/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StoreModel from "@/models/store.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";
import { publishDataChange } from "@/services/realtime";

const parseCategories = (value: FormDataEntryValue | null): number[] => {
    const raw = typeof value === "string" ? value.trim() : "";

    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            return parsed
                .map((item) => Number(item))
                .filter((item) => Number.isInteger(item) && item > 0);
        }
    } catch {
        // fallback to comma-separated string
    }

    return raw
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isInteger(item) && item > 0);
};

const parseShipping = (value: FormDataEntryValue | null) => {
    const defaultShipping = { shortDescription: "", faq: [] };
    const raw = typeof value === "string" ? value.trim() : "";

    if (!raw) return defaultShipping;

    try {
        const parsed = JSON.parse(raw);
        let faqList: Array<{ question?: string; answer?: string }> = [];

        if (Array.isArray(parsed.faq)) {
            faqList = parsed.faq.map((item: any) => ({
                question: typeof item?.question === "string" ? item.question : "",
                answer: typeof item?.answer === "string" ? item.answer : "",
            }));
        } else if (parsed.question || parsed.answer) {
            faqList = [{
                question: typeof parsed.question === "string" ? parsed.question : "",
                answer: typeof parsed.answer === "string" ? parsed.answer : "",
            }];
        }

        return {
            shortDescription: typeof parsed.shortDescription === "string" ? parsed.shortDescription : "",
            faq: faqList,
        };
    } catch {
        return defaultShipping;
    }
};

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const formData = await req.formData();
        const storeId = formData.get("id") as string | null;

        if (!storeId) {
            return sendErrorResponse("Store ID is required for update", 400);
        }

        const existingStore = await StoreModel.findOne({ id: Number(storeId) });

        if (!existingStore) {
            return sendErrorResponse("Store not found", 404);
        }

        const name = (formData.get("name") as string | null)?.trim() || existingStore.name;
        const slug = (formData.get("slug") as string | null)?.trim() || existingStore.slug;
        const description =
            formData.get("description") !== null
                ? ((formData.get("description") as string) || "")
                : existingStore.description;
        const website =
            formData.get("website") !== null
                ? ((formData.get("website") as string) || "")
                : existingStore.website;
        const abn =
            formData.get("abn") !== null
                ? ((formData.get("abn") as string) || "")
                : existingStore.abn;
        const annualRevenue =
            formData.get("annualRevenue") !== null
                ? ((formData.get("annualRevenue") as string) || "")
                : existingStore.annualRevenue;
        const noOfEmployees =
            formData.get("noOfEmployees") !== null
                ? Number(formData.get("noOfEmployees"))
                : existingStore.noOfEmployees;
        const categories =
            formData.get("categories") !== null
                ? parseCategories(formData.get("categories"))
                : existingStore.categories;
        const shipping =
            formData.get("shipping") !== null
                ? parseShipping(formData.get("shipping"))
                : existingStore.shipping;
        const isActive = formData.has("isActive")
            ? formData.get("isActive") === "true"
            : existingStore.isActive;

        const duplicateCheck = await StoreModel.findOne({
            _id: { $ne: existingStore._id },
            $or: [{ name }, { slug }],
        });

        if (duplicateCheck) {
            return sendErrorResponse("Store name or slug is already in use by another store", 400);
        }

        let logoPath = existingStore.logoPath || "";
        let logoId = existingStore.logoId || "";
        const newLogo = formData.get("logo") as File | null;

        if (newLogo && newLogo.size > 0) {
            if (existingStore.logoId) {
                await ImageKitService.deleteImage(existingStore.logoId).catch(() => null);
            }

            const buffer = Buffer.from(await newLogo.arrayBuffer());
            const filename = `${Date.now()}-${newLogo.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/store"
            );

            logoPath = uploaded.url;
            logoId = uploaded.fileId;
        }

        const updatedStore = await StoreModel.findOneAndUpdate(
            { id: Number(storeId) },
            {
                name,
                slug,
                description,
                website,
                abn,
                noOfEmployees,
                annualRevenue,
                categories,
                logoPath,
                logoId,
                shipping,
                isActive,
            },
            { new: true, runValidators: true }
        );

        await publishDataChange("stores");

        return sendSuccessResponse("Store updated successfully", { store: updatedStore });
    } catch (error: any) {
        console.error("Error updating store:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}