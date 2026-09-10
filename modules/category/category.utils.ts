import * as Yup from "yup";

import { CategoryDataType } from "./category.types";

export const addCategoryInitialValues: CategoryDataType = {
    id: 0,
    name: "",
    description: "",
    slug: "",
    imagePath: "",
    imageId: "",
    isActive: true,
};

export const addCategoryValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Category name is required")
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    slug: Yup.string()
        .required("Slug is required")
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        ),

    description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description cannot exceed 500 characters"),
});