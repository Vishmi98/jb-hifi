import * as Yup from "yup";

import { LeafCategoryDataType } from "./leafCategory.types";

export const addLeafCategoryInitialValues: LeafCategoryDataType = {
    id: 0,
    categoryId: 0,
    mainCategoryId: 0,
    subCategoryId: 0,
    name: "",
    description: "",
    leafSlug: "",
    isActive: false,
};

export const addLeafCategoryValidationSchema = Yup.object({
    categoryId: Yup.number().min(1, "Please select a category").required("Please select a category"),
    mainCategoryId: Yup.number().min(1, "Please select a main category").required("Please select a main category"),
    subCategoryId: Yup.number().min(1, "Please select a sub category").required("Please select a sub category"),
    name: Yup.string().required("Name is required"),
    leafSlug: Yup.string().required("Slug is required"),
    description: Yup.string().optional(),
    isActive: Yup.boolean().optional(),
});
