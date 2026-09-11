/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { connectDB } from "@/lib/mongodb";
import StoreModel from "@/models/store.model";
import { sendErrorResponse, sendSuccessResponse } from "@/services/apiResponse";
import { ImageKitService } from "@/services/imagekit";

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
        const name = (formData.get("name") as string | null)?.trim();
        const slug = (formData.get("slug") as string | null)?.trim();
        const description = (formData.get("description") as string | null)?.trim() || "";
        const website = (formData.get("website") as string | null)?.trim() || "";
        const abn = (formData.get("abn") as string | null)?.trim() || "";
        const annualRevenue = (formData.get("annualRevenue") as string | null)?.trim() || "";
        const noOfEmployees = formData.get("noOfEmployees") !== null ? Number(formData.get("noOfEmployees")) : 0;
        const categories = parseCategories(formData.get("categories"));
        const shipping = parseShipping(formData.get("shipping"));
        const isActive = formData.has("isActive") ? formData.get("isActive") === "true" : true;

        if (!name || !slug) {
            return sendErrorResponse("Name and slug are required", 400);
        }

        const existingStore = await StoreModel.findOne({
            $or: [{ name }, { slug }],
        });

        if (existingStore) {
            return sendErrorResponse("Store name or slug already exists", 400);
        }

        let logoPath = "";
        let logoId = "";
        const logo = formData.get("logo") as File | null;

        if (logo && logo.size > 0) {
            const buffer = Buffer.from(await logo.arrayBuffer());
            const filename = `${Date.now()}-${logo.name}`;
            const uploaded = await ImageKitService.uploadImage(
                buffer,
                filename,
                "jb_hifi/store"
            );
            logoPath = uploaded.url;
            logoId = uploaded.fileId;
        }

        const lastItem = await StoreModel.findOne().sort({ id: -1 });
        const nextId = lastItem ? lastItem.id + 1 : 1;

        const store = await StoreModel.create({
            id: nextId,
            name,
            description,
            website,
            slug,
            abn,
            noOfEmployees,
            annualRevenue,
            categories,
            logoPath,
            logoId,
            shipping,
            isActive,
        });

        return sendSuccessResponse("Store created successfully", { store });
    } catch (error: any) {
        console.error("Error creating store:", error);
        return sendErrorResponse(error?.message || "Unexpected error", 500);
    }
}