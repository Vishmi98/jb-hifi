import { CategoryDataType } from "../category/category.types";
import { BrandDataType } from "../homePage/homePage.types";
import { LeafCategoryDataType } from "../leafCategory/leafCategory.types";
import { MainCategoryDataType } from "../mainCategory/mainCategory.types";
import { StoreDataType } from "../store/store.types";
import { SubCategoryDataType } from "../subCategory/subCategory.types";


export interface PaymentRequirementDataType {
    name: string;
    description: string;
}

export interface PaymentMethodDataType {
    id: number;
    name: string;
    slug: string;
    logo?: string;
    logoId?: string;
    minPurchaseAmount: number;
    maxPurchaseAmount: number;
    installmentCount: number;
    repaymentInterval: string;
    shortDescription?: string;
    howItWorks: string[];
    requirements: PaymentRequirementDataType[];
    termsAndConditionsUrl?: string;
    isActive: boolean;
    displayOrder: number;
}

export interface SellTypeDataType {
    id: number;
    name: string;
}

export interface TagLineDataType {
    id: number;
    name: string;
}

export interface ProductSpecificationDataType {
    name: string;
    value: string;
}

export interface ProductVariantDataType {
    id: number;
    productModel: string;
    sku: string;
    price: number;
    originalPrice: number;
    additionalPrice: number;
    stockCount: number;
    color: string;
    colorHexCode: string;
    specifications: ProductSpecificationDataType[];
    imagePath: string;
    imagePathId: string;
}

export interface FeatureDataType {
    title: string;
    description: string;
}

export interface DescriptionDataType {
    paragraph1?: string;
    paragraph2?: string;
    paragraph3?: string;
    features?: FeatureDataType[];
    videoUrl?: string;
}

export interface ProductDataType {
    id: number;
    title: string;
    slug: string;
    description: DescriptionDataType;
    keyFeatures: string[];

    // Categorization & Brand
    brandId: number;
    storeId: number;
    categoryId: number;
    mainCategoryId: number;
    subCategoryId: number;
    leafCategoryId: number;
    ratings: number;
    reviews: string[];

    // Pricing & Inventory
    sellType: number;
    tagLineId: number;
    paymentMethods: number[];

    // Media
    mainImage: string;
    mainImageId: string;
    images: string[];
    imageIds: string[];

    // Variants
    variants: ProductVariantDataType[];

    // Features & Meta
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];

    brandInfo?: BrandDataType;
    storeInfo?: StoreDataType;
    mainCategoryInfo?: MainCategoryDataType;
    categoryInfo?: CategoryDataType;
    subCategoryInfo?: SubCategoryDataType;
    leafCategoryInfo?: LeafCategoryDataType;
    sellTypeInfo?: SellTypeDataType;
    tagLineInfo?: TagLineDataType;
    paymentMethodsInfo?: PaymentMethodDataType[];
}

export interface AddProductFormValues {
    id: number;
    title: string;
    slug: string;
    keyFeatures: string[];

    // Categorization & Brand
    brandId: number;
    storeId: number;
    categoryId: number;
    mainCategoryId: number;
    subCategoryId: number;
    leafCategoryId: number;

    // Pricing & Inventory
    sellType: number;
    tagLineId: number;
    paymentMethods: number[];

    // Media
    mainImage: string;
    mainImageId: string;

    tags: string[];
}

export type ProductsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalProducts: number;
    products: ProductDataType[];
};

export type ProductsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalProducts: number;
        products: ProductDataType[];
    };
};

export type PublishProductResponseDataType = {
    success: boolean;
    message: string;
    data: ProductDataType;
};

export type EditProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: AddProductFormValues | null;
};

export type SingleProductResponseType = {
    success: boolean;
    message: string;
    product: ProductDataType | null;
}

export type SingleProductResponseDataType = {
    success: boolean;
    message: string;
    data: {
        product: ProductDataType;
    };
}

export type PaymentMethodsResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalPaymentMethods: number;
    paymentMethods: PaymentMethodDataType[];
};

export type PaymentMethodsResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalPaymentMethods: number;
        paymentMethods: PaymentMethodDataType[];
    };
};

export type SellTypesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalSellTypes: number;
    sellTypes: SellTypeDataType[];
};

export type SellTypesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalSellTypes: number;
        sellTypes: SellTypeDataType[];
    };
};

export type TagLinesResponseDataType = {
    success: boolean;
    message: string;
    page: number;
    limit: number;
    totalPages: number;
    totalTagLines: number;
    tagLines: TagLineDataType[];
};

export type TagLinesResponseType = {
    success: boolean;
    message: string;
    data: {
        page: number;
        limit: number;
        totalPages: number;
        totalTagLines: number;
        tagLines: TagLineDataType[];
    };
};

export interface AddSpecificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: ProductDataType | null;
    reloadData: () => void;
}

export interface AddProductVariantModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string | number;
    productTitle?: string;
    handleReload: () => void;
}

export type EditProductVariantModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: ProductVariantDataType | null;
    product?: ProductDataType | null; // Accept null here
};

export type EditDescriptionModalProps = {
    isOpen: boolean;
    onClose: () => void;
    reloadData: () => void;
    initialValues: DescriptionDataType | null;
    product?: ProductDataType | null;
};

export type ProductDetailsProps = {
    product: ProductDataType;
};

export type ProductResponseType = {
    success: boolean;
    message: string;
    data?: {
        product: ProductDataType;
        selectedVariant?: ProductVariantDataType | null;
    };
}

export type ProductResponseDataType = {
    success: boolean;
    message: string;
    data: {
        product: ProductDataType;
        selectedVariant?: ProductVariantDataType | null;
    };
}

export interface ProductOverviewProps {
    product: ProductDataType;
    initialVariant?: ProductVariantDataType | null;
    currentSlug: string;
}

export interface ProductCardProps {
    prod: ProductDataType;
    variant?: ProductVariantDataType;
}

export interface BreadcrumbsProps {
    product: ProductOverviewProps['product'];
    currentStorage?: string;
    currentColor?: string;
}

export interface ProductLeftSectionProps {
    product: ProductOverviewProps['product'];
    selectedImage: string;
    setSelectedImage: (img: string) => void;
    currentColor: string;
    currentStorage: string;
    selectedVariant: ProductVariantDataType | null;
    uniqueColorVariants: ProductVariantDataType[];
    uniqueStorageVariants: ProductVariantDataType[];
    handleColorSelect: (color: string) => void;
    handleStorageSelect: (storage: string) => void;
}

export interface ProductRightSectionProps {
    product: ProductOverviewProps['product'];
    selectedVariant: ProductVariantDataType | null;
    currentColor: string;
    currentStorage: string;
    uniqueColorVariants: ProductVariantDataType[];
    uniqueStorageVariants: ProductVariantDataType[];
    handleColorSelect: (color: string) => void;
    handleStorageSelect: (storage: string) => void;
}

export interface ProductAccordionSectionProps {
    product: ProductDataType;
    selectedVariant: ProductVariantDataType | null;
}
