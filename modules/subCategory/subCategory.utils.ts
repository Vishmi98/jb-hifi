import * as Yup from "yup";

import { SubCategoryDataType } from "./subCategory.types";


export const addSubCategoryInitialValues: SubCategoryDataType = {
    id: 0,
    categoryId: 0,
    mainCategoryId: 0,
    name: "",
    description: "",
    subSlug: "",
    isActive: false,
};

export const addSubCategoryValidationSchema = Yup.object({
    mainCategoryId: Yup.number().min(1, "Please select a main category").required("Please select a main category"),
    name: Yup.string().required("Name is required"),
    subSlug: Yup.string().required("Slug is required"),
    description: Yup.string().optional(),
    isActive: Yup.boolean().optional(),
});
