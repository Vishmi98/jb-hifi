import { CategoryDataType } from "../category/category.types";
import { BrandDataType } from "../homePage/homePage.types";
import { LeafCategoryDataType } from "../leafCategory/leafCategory.types";
import { MainCategoryDataType } from "../mainCategory/mainCategory.types";
import { SubCategoryDataType } from "../subCategory/subCategory.types";

export interface BannerItemDataType {
    id: number;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    leafCategoryId?: number;
    brandId?: number;
    productId?: number;
    imagePath?: string;
    imageId?: string;
    categoryInfo?: CategoryDataType;
    mainCategoryInfo?: MainCategoryDataType;
    subCategoryInfo?: SubCategoryDataType;
    leafCategoryInfo?: LeafCategoryDataType;
    brandInfo?: BrandDataType;
    productInfo?: {
        id: number;
        name: string;
    };
}

export interface BannerCollectionDataType {
    id: number;
    bannerType: string;
    items: BannerItemDataType[];
    isActive: boolean;
}

export type BannerCollectionsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalBannerCollections: number;
    bannerCollections: BannerCollectionDataType[];
};

export type BannerCollectionsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalBanners: number;
        banners: BannerCollectionDataType[];
    };
};

export type CreateBannerCollectionResponseDataType = {
    success: boolean;
    message: string;
    data: {
        banner: BannerCollectionDataType;
    };
};

export type DeleteBannerCollectionResponseDataType = {
    success: boolean;
    message: string;
    data: {
        banner: BannerCollectionDataType;
    };
};

export type PublishBannerCollectionResponseDataType = {
    success: boolean;
    message: string;
    data: BannerCollectionDataType;
}

export interface GetBannerByTypePayloadType {
    bannerType: string;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    leafCategoryId?: number;
    brandId?: number;
    productId?: number;
}

export interface GetBannerByTypeResponseType {
    success: boolean;
    message: string;
    data?: BannerCollectionDataType
}