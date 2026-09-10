import { CategoryDataType } from "../category/category.types";
import { MainCategoryDataType } from "../mainCategory/mainCategory.types";

export interface SubCategoryDataType {
    id: number;
    categoryId: number;
    mainCategoryId: number;
    name: string;
    description: string;
    subSlug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
    mainCategoryInfo?: MainCategoryDataType;
    categoryInfo?: CategoryDataType;
}

export type SubCategoriesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalSubCategories: number;
    subCategories: SubCategoryDataType[];
};

export type SubCategoriesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalSubCategories: number;
        subCategories: SubCategoryDataType[];
    };
};

export type PublishSubCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: SubCategoryDataType;
};

export type EditSubCategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: SubCategoryDataType | null;
};

export type SubCategoriesByMainCategoriesResponseType = {
    success: boolean;
    message: string;
    subCategories: SubCategoryDataType[];
};

export type SubCategoriesByMainCategoriesResponseDataType = {
    success: boolean;
    message: string;
    data?: {
        subCategories: SubCategoryDataType[];
    };
};

export type SingleSubCategoryResponseType = {
    success: boolean;
    message: string;
    subCategory: SubCategoryDataType | null;
}

export type SingleSubCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: {
        subCategory: SubCategoryDataType;
    };
}

export type SubCategoryDetailsProps = {
    subCategory: SubCategoryDataType
}