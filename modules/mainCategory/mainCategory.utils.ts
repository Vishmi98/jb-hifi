import * as Yup from "yup";

import { MainCategoryDataType } from "./mainCategory.types";


export const addMainCategoryInitialValues: MainCategoryDataType = {
    id: 0,
    categoryId: 0,
    name: "",
    description: "",
    mainSlug: "",
    imagePath: "",
    imageId: "",
    isActive: true,
    categoryInfo: undefined,
};

export const addMainCategoryValidationSchema = Yup.object().shape({
    categoryId: Yup.number()
        .required("Category is required")
        .min(1, "Please select a valid category"),

    name: Yup.string()
        .required("Main category name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    mainSlug: Yup.string()
        .required("Main slug is required")
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Main slug must contain only lowercase letters, numbers, and hyphens"
        ),

    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description cannot exceed 500 characters"),
});
