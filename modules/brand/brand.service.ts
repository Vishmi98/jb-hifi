import axios from "axios";

import { BrandsResponseDataType, BrandsResponseType, PublishBrandResponseDataType, SingleBrandResponseDataType, SingleBrandResponseType, UpdateBrandRedirectPathPayload } from "./brand.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getBrands = async (
    page?: number,
    limit?: number
): Promise<BrandsResponseDataType> => {
    const response: BrandsResponseType = await apiCall({
        url: `${URL}/brand/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        brands: data.brands || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalBrands: data.totalBrands ?? 0,
    };
};

export const getBrandBySlug = async (props: { slug: string }): Promise<SingleBrandResponseType> => {
    const { slug } = props;

    const response: SingleBrandResponseDataType = await apiCall({
        url: `${URL}/brand/get-by-slug`,
        method: 'POST',
        body: { slug },
    })

    return ({
        success: response.success,
        message: response.message,
        brand: response.data.brand
    });
};

export const publishBrand = async (
    id: number,
    isPublish: boolean
): Promise<PublishBrandResponseDataType> => {
    const response: PublishBrandResponseDataType = await apiCall({
        url: `${URL}/brand/publish`,
        method: "POST",
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteBrand = async (
    id: number
): Promise<PublishBrandResponseDataType> => {
    const response: PublishBrandResponseDataType = await apiCall({
        url: `${URL}/brand/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createBrand = async (data: FormData) => {
    const res = await axios.post(`${URL}/brand/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            brand: response.data,
        },
    };
};

export const updateBrand = async (data: FormData) => {
    const res = await axios.post(`${URL}/brand/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            brand: response.data,
        },
    };
};

export const addBrandBanners = async (data: FormData) => {
    const res = await axios.post(`${URL}/brand/add-banners`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const addBrandCollections = async (data: FormData) => {
    const res = await axios.post(`${URL}/brand/add-collections`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteBrandBanner = async ({
    brandId,
    bannerImageId,
    bannerImageUrl,
    index,
}: {
    brandId: number;
    bannerImageId?: string;
    bannerImageUrl?: string;
    index?: number;
}) => {
    const formData = new FormData();
    formData.append("id", String(brandId));

    if (bannerImageId) formData.append("bannerImageId", bannerImageId);
    if (bannerImageUrl) formData.append("bannerImageUrl", bannerImageUrl);
    if (index !== undefined) formData.append("index", String(index));

    const res = await axios.post(`${URL}/brand/delete-banner`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteBrandCollection = async ({
    brandId,
    collectionId,
    imagePathId,
    index,
}: {
    brandId: number;
    collectionId?: string;
    imagePathId?: string;
    index?: number;
}) => {
    const formData = new FormData();
    formData.append("id", String(brandId));

    if (collectionId) formData.append("collectionId", collectionId);
    if (imagePathId) formData.append("imagePathId", imagePathId);
    if (index !== undefined) formData.append("index", String(index));

    const res = await axios.post(`${URL}/brand/delete-collection`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const updateBrandRedirectPath = async (payload: UpdateBrandRedirectPathPayload): Promise<PublishBrandResponseDataType> => {
    const { id, categoryId, mainCategoryId, subCategoryId, leafCategoryId } = payload

    const response: PublishBrandResponseDataType = await apiCall({
        url: `${URL}/brand/update-redirect-path`,
        method: "POST",
        body: { id, categoryId, mainCategoryId, subCategoryId, leafCategoryId },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};