import * as Yup from "yup";

import { BrandDataType, CollectionDataType } from "./brand.types";


export const collectionInitialValues: CollectionDataType = {
    _id: "",
    imagePath: "",
    imagePathId: "",
    categoryId: undefined,
    mainCategoryId: undefined,
    subCategoryId: undefined,
    compareLink: "",
};

export const collectionValidationSchema = Yup.object().shape({
    mainCategoryId: Yup.number().nullable().optional(),
    categoryId: Yup.number().nullable().optional(),
    subCategoryId: Yup.number().nullable().optional(),
    compareLink: Yup.string()
        .url("Compare link must be a valid URL")
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .optional(),
});

export const addBrandInitialValues: BrandDataType = {
    id: 0,
    name: "",
    slug: "",
    logo: "",
    logoId: "",
    bannerImages: [],
    bannerImageIds: [],
    shortDescription: "",
    videoLink: "",
    collections: [],
    isFeatured: true,
    isActive: true,
    haveSinglePage: true,
    mainCategoryId: undefined,
    categoryId: undefined,
    subCategoryId: undefined,
    leafCategoryId: undefined,
};

export const addBrandValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Brand name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters")
        .trim(),

    slug: Yup.string()
        .required("Slug is required")
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        )
        .trim(),

    shortDescription: Yup.string()
        .max(1000, "Short description cannot exceed 1000 characters")
        .optional(),

    videoLink: Yup.string()
        .url("Video link must be a valid URL")
        .nullable()
        .transform((value) => (value === "" ? null : value))
        .optional(),

});