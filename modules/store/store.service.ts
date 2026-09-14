import axios from "axios";

import {
    PublishStoreResponseDataType,
    SingleStoreResponseDataType,
    SingleStoreResponseType,
    StoresResponseDataType,
    StoresResponseType,
} from "./store.types";

import apiCall from "@/services/api.services";
import { URL } from "@/constants/config";

export const getStores = async (
    page?: number,
    limit?: number
): Promise<StoresResponseDataType> => {
    const response: StoresResponseType = await apiCall({
        url: `${URL}/store/get-all`,
        method: "POST",
        body: { page, limit: limit || 5 },
    });

    const data = response.data || {};

    return {
        success: response.success ?? false,
        message: response.message || "No message provided",
        stores: data.stores || [],
        page: data.page ?? 1,
        limit: data.limit ?? 5,
        totalPages: data.totalPages ?? 0,
        totalStores: data.totalStores ?? 0,
    };
};

export const publishStore = async (
    id: number,
    isPublish: boolean
): Promise<PublishStoreResponseDataType> => {
    const response: PublishStoreResponseDataType = await apiCall({
        url: `${URL}/store/publish`,
        method: "POST",
        body: { id, isPublish },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const deleteStore = async (
    id: number
): Promise<PublishStoreResponseDataType> => {
    const response: PublishStoreResponseDataType = await apiCall({
        url: `${URL}/store/delete-by-id`,
        method: "DELETE",
        body: { id },
    });

    return {
        success: response.success,
        message: response.message,
        data: response.data,
    };
};

export const createStore = async (data: FormData) => {
    const res = await axios.post(`${URL}/store/create`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            store: response.data,
        },
    };
};

export const updateStore = async (data: FormData) => {
    const res = await axios.post(`${URL}/store/update`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const response = res.data;

    return {
        success: response.success,
        message: response.message,
        data: {
            store: response.data,
        },
    };
};

export const getStoreBySlug = async (props: { slug: string }): Promise<SingleStoreResponseType> => {
    const { slug } = props;

    const response: SingleStoreResponseDataType = await apiCall({
        url: `${URL}/store/get-by-slug`,
        method: 'POST',
        body: { slug },
    })

    return ({
        success: response.success,
        message: response.message,
        store: response.data.store
    });
};