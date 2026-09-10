import axios from "axios";

import {
    MainCategoriesByCategoriesResponseDataType,
    MainCategoriesByCategoriesResponseType,
    MainCategoriesResponseDataType,
    MainCategoriesResponseType,
    PublishMainCategoryResponseDataType,
    SingleMainCategoryResponseDataType,
    SingleMainCategoryResponseType,
} from "./mainCategory.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getMainCategories = async (
    page?: number,
    limit?: number
): Promise<MainCategoriesResponseDataType> => {
    const response: MainCategoriesResponseType = await apiCall({
        url: `${URL}/mainCategory/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        mainCategories: data.mainCategories || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalMainCategories: data.totalMainCategories ?? 0,
    };
};

export const publishMainCategory = async (
    id: number,
    isPublish: boolean
): Promise<PublishMainCategoryResponseDataType> => {
    const response: PublishMainCategoryResponseDataType = await apiCall({
        url: `${URL}/mainCategory/publish`,
        method: "POST",
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteMainCategory = async (
    id: number
): Promise<PublishMainCategoryResponseDataType> => {
    const response: PublishMainCategoryResponseDataType = await apiCall({
        url: `${URL}/mainCategory/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createMainCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/mainCategory/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            mainCategory: response.data,
        },
    };
};

export const updateMainCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/mainCategory/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            mainCategory: response.data,
        },
    };
};

export const getMainCategoryByCategory = async (props: {
    categoryId: number;
}): Promise<MainCategoriesByCategoriesResponseType> => {
    const { categoryId } = props;

    const response: MainCategoriesByCategoriesResponseDataType = await apiCall({
        url: `${URL}/mainCategory/get-by-category`,
        method: "POST",
        body: { categoryId },
    });

    return {
        success: response.success,
        message: response.message,
        mainCategories: response?.data?.mainCategories ?? [],
    };
};

export const getMainCategoryBySlug = async (props: { mainSlug: string }): Promise<SingleMainCategoryResponseType> => {
    const { mainSlug } = props;

    const response: SingleMainCategoryResponseDataType = await apiCall({
        url: `${URL}/mainCategory/get-by-slug`,
        method: 'POST',
        body: { mainSlug },
    })

    return ({
        success: response.success,
        message: response.message,
        mainCategory: response.data.mainCategory
    });
};