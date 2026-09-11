import { CategoryDataType } from "../category/category.types";
import { MainCategoryDataType } from "../mainCategory/mainCategory.types";
import { SubCategoryDataType } from "../subCategory/subCategory.types";

export interface LeafCategoryDataType {
    id: number;
    categoryId: number;
    mainCategoryId: number;
    subCategoryId: number;
    name: string;
    description: string;
    leafSlug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    categoryInfo?: CategoryDataType;
    mainCategoryInfo?: MainCategoryDataType;
    subCategoryInfo?: SubCategoryDataType;
}

export type LeafCategoriesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalLeafCategories: number;
    leafCategories: LeafCategoryDataType[];
};

export type LeafCategoriesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalLeafCategories: number;
        leafCategories: LeafCategoryDataType[];
    };
};

export type PublishLeafCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: LeafCategoryDataType;
};

export type EditLeafCategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: LeafCategoryDataType | null;
};

export type SingleLeafCategoryResponseType = {
    success: boolean;
    message: string;
    leafCategory: LeafCategoryDataType | null;
};

export type SingleLeafCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        leafCategory: LeafCategoryDataType;
    };
};

export type LeafCategoryDetailsProps = {
    leafCategory: LeafCategoryDataType;
};

export type LeafCategoriesBySubCategoriesResponseType = {
    success: boolean;
    message: string;
    leafCategories: LeafCategoryDataType[];
};

export type LeafCategoriesBySubCategoriesResponseDataType = {
    success: boolean;
    message: string;
    data?: {
        leafCategories: LeafCategoryDataType[];
    };
};