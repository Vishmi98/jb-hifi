import { CategoryDataType } from "../category/category.types";
import { MainCategoryDataType } from "../mainCategory/mainCategory.types";
import { SubCategoryDataType } from "../subCategory/subCategory.types";

export interface CollectionDataType {
    _id: string;
    imagePath?: string;
    imagePathId?: string;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    compareLink?: string;
    mainCategoryInfo?: MainCategoryDataType;
    categoryInfo?: CategoryDataType;
    subCategoryInfo?: SubCategoryDataType;
}

export interface BrandDataType {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    logoId?: string;
    bannerImages?: string[];
    bannerImageIds?: string[];
    shortDescription?: string;
    videoLink?: string;
    collections?: CollectionDataType[];
    isFeatured: boolean;
    isActive: boolean;
}

export type BrandsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalBrands: number;
    brands: BrandDataType[];
};

export type BrandsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalBrands: number;
        brands: BrandDataType[];
    };
};

export type PublishBrandResponseDataType = {
    success: boolean;
    message: string;
    data: BrandDataType;
};

export type EditBrandModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: BrandDataType | null;
};

export type SingleBrandResponseType = {
    success: boolean;
    message: string;
    brand: BrandDataType | null;
}

export type SingleBrandResponseDataType = {
    success: boolean;
    message: string;
    data: {
        brand: BrandDataType;
    };
}

export type BrandDetailsProps = {
    brand: BrandDataType
}

export interface AddBannerModalProps {
    isOpen: boolean;
    onClose: () => void;
    brand: BrandDataType | null;
    reloadData: () => void;
}