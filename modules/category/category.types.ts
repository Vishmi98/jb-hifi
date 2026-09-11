export interface CategoryDataType {
    id: number;
    name: string;
    description: string;
    slug: string;
    imagePath?: string;
    imageId?: string;
    isActive: boolean;
}

export type CategoriesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalCategories: number;
    categories: CategoryDataType[];
}

export type CategoriesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalCategories: number;
        categories: CategoryDataType[];
    }
}

export type CategoryDetailsProps = {
    category: CategoryDataType
}

export type PublishCategoryResponseDataType = {
    success: boolean;
    message: string;
    data: CategoryDataType;
}

export type EditCategoryModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: CategoryDataType | null;
}

export interface HeroCarouselProps {
    bannerType?: "category" | "main category" | "sub category" | "leaf category" | "brand" | "home" | "product";
    categoryId?: number;
    mainCategoryId?: number;
    subCategoryId?: number;
    leafCategoryId?: number;
    brandId?: number;
    productId?: number;
}