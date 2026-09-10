import axios from "axios";

import { CategoriesResponseDataType, CategoriesResponseType, PublishCategoryResponseDataType } from "./category.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getCategories = async (page?: number, limit?: number): Promise<CategoriesResponseDataType> => {
    const response: CategoriesResponseType = await apiCall({
        url: `${URL}/category/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        categories: data.categories || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalCategories: data.totalCategories ?? 0,
    };
};

export const publishCategory = async (id: number, isPublish: boolean): Promise<PublishCategoryResponseDataType> => {
    const response: PublishCategoryResponseDataType = await apiCall({
        url: `${URL}/category/publish`,
        method: 'POST',
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data
    };
};

export const deleteCategory = async (id: number): Promise<PublishCategoryResponseDataType> => {
    const response: PublishCategoryResponseDataType = await apiCall({
        url: `${URL}/category/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/category/create`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            category: response.data,
        },
    };
};

export const updateCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/category/update`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            category: response.data,
        },
    };
};