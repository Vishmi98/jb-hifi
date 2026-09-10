import { CategoryDataType } from "../category/category.types";

export interface ProductDataType {
    id: number;
    title: string;
    image: string;
    badge?: string;
    badgeType?: string;
    badge2?: string;
    badgeType2?: string;
    secondaryBadge?: string;
    rating?: number;
    reviews?: number;
    price: number;
    originalPrice?: number;
    priceTagLabel?: string;
    savings?: string;
    tagline?: string;
    brand?: string;
    buttonText?: string;
}

export interface SustainabilityCardProps {
    id: string;
    title: string;
    href?: string;
    image: string;
}

export interface CollectionDataType {
    imagePath?: string;
    imagePathId?: string;
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
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
}

export type BrandsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalBrands: number;
        brands: BrandDataType[];
    }
}

export type SingleCategoryResponseType = {
    success: boolean;
    message: string;
    category: CategoryDataType | null;
}

export type SingleCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        category: CategoryDataType;
    };
}
