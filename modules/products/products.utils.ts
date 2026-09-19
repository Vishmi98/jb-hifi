import * as Yup from "yup";

import {
    AddProductFormValues,
    ProductSpecificationDataType,
    ProductVariantDataType,
} from "./products.types";

// ==========================================
// Product Specification Utilities
// ==========================================

export const productSpecificationInitialValues: ProductSpecificationDataType = {
    name: "",
    value: "",
};

export const productSpecificationValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Specification name is required")
        .trim(),
    value: Yup.string()
        .required("Specification value is required")
        .trim(),
});

// ==========================================
// Product Variant Utilities
// ==========================================

export const productVariantInitialValues: ProductVariantDataType = {
    id: 0,
    productModel: "",
    sku: "",
    price: 0,
    originalPrice: 0,
    additionalPrice: 0,
    stockCount: 0,
    color: "",
    colorHexCode: "",
    specifications: [],
    imagePath: "",
    imagePathId: "",
};

export const productVariantValidationSchema = Yup.object().shape({
    id: Yup.number()
        .integer("ID must be an integer")
        .optional(),

    productModel: Yup.string()
        .trim()
        .optional(),

    sku: Yup.string()
        .trim()
        .optional(),

    price: Yup.number(),

    originalPrice: Yup.number()
        .typeError("Original price must be a number")
        .min(0, "Original price cannot be negative")
        .required("Price is required"),

    additionalPrice: Yup.number()
        .optional(),

    stockCount: Yup.number(),

    color: Yup.string()
        .trim()
        .optional(),

    colorHexCode: Yup.string()
        .trim()
        .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
            message: "Must be a valid HEX color code (e.g., #FFFFFF or #FFF)",
            excludeEmptyString: true,
        })
        .optional(),

    specifications: Yup.array()
        .of(productSpecificationValidationSchema)
        .default([]),
});

// ==========================================
// Product Utilities
// ==========================================

export const addFullProductInitialValues: AddProductFormValues = {
    id: 0,
    title: "",
    slug: "",
    keyFeatures: [],

    brandId: 0,
    storeId: 0,
    categoryId: 0,
    mainCategoryId: 0,
    subCategoryId: 0,
    leafCategoryId: 0,

    sellType: 0,
    tagLineId: 0,
    paymentMethods: [],

    mainImage: "",
    mainImageId: "",

    tags: [],
};

export const addFullProductValidationSchema = Yup.object().shape({
    title: Yup.string()
        .required("Product title is required")
        .min(3, "Title must be at least 3 characters")
        .max(150, "Title cannot exceed 150 characters")
        .trim(),

    slug: Yup.string()
        .required("Slug is required")
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        )
        .trim(),

    keyFeatures: Yup.array()
        .of(Yup.string().required("Feature text cannot be empty"))
        .optional(),

    // Categorization & Relations
    brandId: Yup.number().nullable().optional(),
    storeId: Yup.number().nullable().optional(),
    mainCategoryId: Yup.number().nullable().optional(),
    categoryId: Yup.number().nullable().optional(),
    subCategoryId: Yup.number().nullable().optional(),
    leafCategoryId: Yup.number().nullable().optional(),

    sellType: Yup.number().nullable().optional(),
    tagLineId: Yup.number().nullable().optional(),

    paymentMethods: Yup.array()
        .of(Yup.number().required())
        .min(1, "Select at least one payment method"),

    tags: Yup.array().of(Yup.string()).optional(),
});
