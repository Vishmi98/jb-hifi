import { CategoryDataType } from "../category/category.types";

export interface MainCategoryDataType {
    id: number;
    categoryId: number;
    name: string;
    description: string;
    mainSlug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    categoryInfo?: CategoryDataType;
}

export type MainCategoriesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalMainCategories: number;
    mainCategories: MainCategoryDataType[];
};

export type MainCategoriesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalMainCategories: number;
        mainCategories: MainCategoryDataType[];
    };
};

export type PublishMainCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: MainCategoryDataType;
};

export type EditMainCategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: MainCategoryDataType | null;
};

export type MainCategoriesByCategoriesResponseType = {
    success: boolean;
    message: string;
    mainCategories: MainCategoryDataType[];
};

export type MainCategoriesByCategoriesResponseDataType = {
    success: boolean;
    message: string;
    data?: {
        mainCategories: MainCategoryDataType[];
    };
};

export type SingleMainCategoryResponseType = {
    success: boolean;
    message: string;
    mainCategory: MainCategoryDataType | null;
}

export type SingleMainCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        mainCategory: MainCategoryDataType;
    };
}

export type MainCategoryDetailsProps = {
    mainCategory: MainCategoryDataType
}