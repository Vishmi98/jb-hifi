export interface ShippingDataType {
    shortDescription?: string;
    faq: {
        question?: string;
        answer?: string;
    }[]
}

export interface StoreDataType {
    id: number;
    name: string;
    slug: string;
    description?: string;
    website?: string;
    abn?: string;
    noOfEmployees?: number;
    annualRevenue?: string;
    categories?: number[];
    logoPath?: string;
    logoId?: string;
    shipping?: ShippingDataType;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export type StoresResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalStores: number;
    stores: StoreDataType[];
};

export type StoresResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalStores: number;
        stores: StoreDataType[];
    };
};

export type PublishStoreResponseDataType = {
    success: boolean;
    message: string;
    data: StoreDataType;
};

export type EditStoreModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialValues: StoreDataType | null;
    reloadData: () => void;
};