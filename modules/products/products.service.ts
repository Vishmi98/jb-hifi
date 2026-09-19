import axios from "axios";

import { PaymentMethodsResponseDataType, PaymentMethodsResponseType, ProductsResponseDataType, ProductsResponseType, PublishProductResponseDataType, SellTypesResponseDataType, SellTypesResponseType, SingleProductResponseDataType, SingleProductResponseType, TagLinesResponseDataType, TagLinesResponseType } from "./products.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";


export const getProducts = async (
    page?: number,
    limit?: number
): Promise<ProductsResponseDataType> => {
    const response: ProductsResponseType = await apiCall({
        url: `${URL}/product/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        products: data.products || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalProducts: data.totalProducts ?? 0,
    };
};

export const getProductBySlug = async (props: { slug: string }): Promise<SingleProductResponseType> => {
    const { slug } = props;

    const response: SingleProductResponseDataType = await apiCall({
        url: `${URL}/product/get-by-slug`,
        method: 'POST',
        body: { slug },
    })

    return ({
        success: response.success,
        message: response.message,
        product: response.data.product
    });
};

export const publishProduct = async (
    id: number,
    isPublish: boolean
): Promise<PublishProductResponseDataType> => {
    const response: PublishProductResponseDataType = await apiCall({
        url: `${URL}/product/publish`,
        method: "POST",
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteProduct = async (
    id: number
): Promise<PublishProductResponseDataType> => {
    const response: PublishProductResponseDataType = await apiCall({
        url: `${URL}/product/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createProduct = async (data: FormData) => {
    const res = await axios.post(`${URL}/product/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            product: response.data,
        },
    };
};

export const updateProduct = async (data: FormData) => {
    const res = await axios.post(`${URL}/product/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            product: response.data,
        },
    };
};

export const addProductSpecifications = async (data: FormData) => {
    const res = await axios.post(`${URL}/product/add-specifications`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const addProductImages = async (data: FormData) => {
    const res = await axios.post(`${URL}/product/add-images`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteProductImage = async ({
    productId,
    imageId,
    imageUrl,
    index,
}: {
    productId: string | number;
    imageId?: string;
    imageUrl?: string;
    index?: number;
}) => {
    const formData = new FormData();
    formData.append("productId", String(productId));

    if (imageId) formData.append("imageId", imageId);
    if (imageUrl) formData.append("imageUrl", imageUrl);
    if (index !== undefined) formData.append("index", String(index));

    const res = await axios.post(`${URL}/product/delete-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const addProductVariants = async (data: FormData) => {
    const res = await axios.post(`${URL}/product/add-variant`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const updateProductVariant = async (data: FormData) => {
    const res = await axios.post(`${URL}/product/update-variant`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            product: response.data,
        },
    };
};

export const deleteProductVariant = async ({
    productId,
    variantId,
}: {
    productId: string | number;
    variantId?: string | number;
}) => {
    const formData = new FormData();
    formData.append("productId", String(productId));

    if (variantId) formData.append("variantId", String(variantId));

    const res = await axios.post(`${URL}/product/delete-variant`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};


export const getPaymentMethods = async (
    page?: number,
    limit?: number
): Promise<PaymentMethodsResponseDataType> => {
    const response: PaymentMethodsResponseType = await apiCall({
        url: `${URL}/paymentMethod/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        paymentMethods: data.paymentMethods || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalPaymentMethods: data.totalPaymentMethods ?? 0,
    };
};

export const getSellTypes = async (
    page?: number,
    limit?: number
): Promise<SellTypesResponseDataType> => {
    const response: SellTypesResponseType = await apiCall({
        url: `${URL}/sellType/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        sellTypes: data.sellTypes || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalSellTypes: data.totalSellTypes ?? 0,
    };
};

export const getTagLines = async (
    page?: number,
    limit?: number
): Promise<TagLinesResponseDataType> => {
    const response: TagLinesResponseType = await apiCall({
        url: `${URL}/tagLine/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        tagLines: data.tagLines || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalTagLines: data.totalTagLines ?? 0,
    };
};