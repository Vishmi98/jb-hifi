import { BrandsResponseDataType, BrandsResponseType, SingleCategoryResponseDataType, SingleCategoryResponseType } from "./homePage.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getCategoryBySlug = async (props: { slug: string }): Promise<SingleCategoryResponseType> => {
    const { slug } = props;

    const response: SingleCategoryResponseDataType = await apiCall({
        url: `${URL}/category/get-by-slug`,
        method: 'POST',
        body: { slug },
    })

    return ({
        success: response.success,
        message: response.message,
        category: response.data.category
    });
};

export const getBrands = async (page?: number, limit?: number): Promise<BrandsResponseDataType> => {
    const response: BrandsResponseType = await apiCall({
        url: `${URL}/brand/get-all`,
        method: 'POST',
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || 'No message provided',
        brands: data.brands || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalBrands: data.totalBrands ?? 0,
    };
};