import axios from "axios";

import {
    SubCategoriesResponseDataType,
    SubCategoriesResponseType,
    PublishSubCategoryResponseDataType,
    SubCategoriesByMainCategoriesResponseType,
    SubCategoriesByMainCategoriesResponseDataType,
    SingleSubCategoryResponseType,
    SingleSubCategoryResponseDataType,
} from "./subCategory.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getSubCategories = async (
    page?: number,
    limit?: number
): Promise<SubCategoriesResponseDataType> => {
    const response: SubCategoriesResponseType = await apiCall({
        url: `${URL}/subCategory/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        subCategories: data.subCategories || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalSubCategories: data.totalSubCategories ?? 0,
    };
};

export const publishSubCategory = async (
    id: number,
    isPublish: boolean
): Promise<PublishSubCategoryResponseDataType> => {
    const response: PublishSubCategoryResponseDataType = await apiCall({
        url: `${URL}/subCategory/publish`,
        method: "POST",
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteSubCategory = async (
    id: number
): Promise<PublishSubCategoryResponseDataType> => {
    const response: PublishSubCategoryResponseDataType = await apiCall({
        url: `${URL}/subCategory/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createSubCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/subCategory/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            subCategory: response.data,
        },
    };
};

export const updateSubCategory = async (data: FormData) => {
    const res = await axios.post(`${URL}/subCategory/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            subCategory: response.data,
        },
    };
};

export const getSubCategoryByMainCategory = async (props: {
    mainCategoryId: number;
}): Promise<SubCategoriesByMainCategoriesResponseType> => {
    const { mainCategoryId } = props;

    const response: SubCategoriesByMainCategoriesResponseDataType = await apiCall({
        url: `${URL}/subCategory/get-by-mainCategory`,
        method: "POST",
        body: { mainCategoryId },
    });

    return {
        success: response.success,
        message: response.message,
        subCategories: response?.data?.subCategories ?? [],
    };
};

export const getSubCategoryBySlug = async (props: { subSlug: string }): Promise<SingleSubCategoryResponseType> => {
    const { subSlug } = props;

    const response: SingleSubCategoryResponseDataType = await apiCall({
        url: `${URL}/subCategory/get-by-slug`,
        method: 'POST',
        body: { subSlug },
    })

    return ({
        success: response.success,
        message: response.message,
        subCategory: response.data.subCategory
    });
};