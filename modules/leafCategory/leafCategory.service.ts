import axios from "axios";

import {
    LeafCategoriesResponseDataType,
    LeafCategoriesResponseType,
    PublishLeafCategoryResponseDataType,
    SingleLeafCategoryResponseDataType,
    SingleLeafCategoryResponseType,
} from "./leafCategory.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getLeafCategories = async (
    page?: number,
    limit?: number
): Promise<LeafCategoriesResponseDataType> => {
    const response: LeafCategoriesResponseType = await apiCall({
        url: `${URL}/leafCategory/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        leafCategories: data.leafCategories || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalLeafCategories: data.totalLeafCategories ?? 0,
    };
};

export const publishLeafCategory = async (
    id: number,
    isPublish: boolean
): Promise<PublishLeafCategoryResponseDataType> => {
    const response: PublishLeafCategoryResponseDataType = await apiCall({
        url: `${URL}/leafCategory/publish`,
        method: "POST",
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteLeafCategory = async (
    id: number
): Promise<PublishLeafCategoryResponseDataType> => {
    const response: PublishLeafCategoryResponseDataType = await apiCall({
        url: `${URL}/leafCategory/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createLeafCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/leafCategory/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            leafCategory: response.data,
        },
    };
};

export const updateLeafCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/leafCategory/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            leafCategory: response.data,
        },
    };
};

export const getLeafCategoryBySlug = async (props: {
    leafSlug: string;
}): Promise<SingleLeafCategoryResponseType> => {
    const { leafSlug } = props;

    const response: SingleLeafCategoryResponseDataType = await apiCall({
        url: `${URL}/leafCategory/get-by-slug`,
        method: "POST",
        body: { leafSlug },
    });

    return {
        success: response.success,
        message: response.message,
        leafCategory: response.data.leafCategory,
    };
};
