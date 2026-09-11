import axios from "axios";

import {
    BannerCollectionsResponseDataType,
    BannerCollectionsResponseType,
    CreateBannerCollectionResponseDataType,
    DeleteBannerCollectionResponseDataType,
    GetBannerByTypePayloadType,
    GetBannerByTypeResponseType,
    PublishBannerCollectionResponseDataType,
} from "./bannerCollection.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getBannerCollections = async (
    page?: number,
    limit?: number
): Promise<BannerCollectionsResponseDataType> => {
    const response: BannerCollectionsResponseType = await apiCall({
        url: `${URL}/banner/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        bannerCollections: data.banners || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalBannerCollections: data.totalBanners ?? 0,
    };
};

export const createBannerCollection = async (data: { bannerType: string }) => {
    const response: CreateBannerCollectionResponseDataType = await apiCall({
        url: `${URL}/banner/create`,
        method: "POST",
        body: data,
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const publishBannerCollection = async (id: number, isPublish: boolean): Promise<PublishBannerCollectionResponseDataType> => {
    const response: PublishBannerCollectionResponseDataType = await apiCall({
        url: `${URL}/banner/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const deleteBannerCollection = async (id: number): Promise<DeleteBannerCollectionResponseDataType> => {
    const response: DeleteBannerCollectionResponseDataType = await apiCall({
        url: `${URL}/banner/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const addBannerItem = async (data: FormData) => {
    const res = await axios.post(`${URL}/banner/add-item`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const getBannerByType = async (props: GetBannerByTypePayloadType) => {
    try {
        const { bannerType, categoryId, mainCategoryId, subCategoryId, leafCategoryId, brandId, productId } = props;

        const response: GetBannerByTypeResponseType = await apiCall({
            url: `${URL}/banner/get-by-type`,
            method: "POST",
            body: { bannerType, categoryId, mainCategoryId, subCategoryId, leafCategoryId, brandId, productId }, // Pass payload directly, do not wrap in { payload }
        });

        return {
            success: response.success ?? false,
            message: response.message || "No message provided",
            data: response.data || null,
        };
    } catch (error) {
        return {
            success: false,
            message: "Banner not found",
            data: null,
        };
    }
};