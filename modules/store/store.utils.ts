import * as Yup from "yup";

import { StoreDataType } from "./store.types";


export const addStoreInitialValues: StoreDataType = {
    id: 0,
    name: "",
    slug: "",
    description: "",
    website: "",
    abn: "",
    noOfEmployees: 0,
    annualRevenue: "",
    categories: [],
    logoPath: "",
    logoId: "",
    shipping: {
        shortDescription: "",
        faq: [
            {
                question: "",
                answer: "",
            }
        ]
    },
    isActive: true,
};

export const addStoreValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required("Store name is required")
        .min(2, "Store name must be at least 2 characters")
        .max(100, "Store name cannot exceed 100 characters"),

    slug: Yup.string()
        .required("Slug is required")
        .matches(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Slug must contain only lowercase letters, numbers, and hyphens"
        ),

    description: Yup.string()
        .optional()
        .min(50, "Description must be at least 50 characters")
        .max(1000, "Description cannot exceed 1000 characters"),

    website: Yup.string()
        .optional()
        .url("Please enter a valid URL (e.g., https://example.com)"),

    abn: Yup.string()
        .optional()
        .matches(/^\d{11}$/, "ABN must be exactly 11 digits"),

    noOfEmployees: Yup.number()
        .optional()
        .min(0, "Number of employees cannot be negative")
        .integer("Must be a whole number"),

    annualRevenue: Yup.string().optional(),

    categories: Yup.array(),

    logoPath: Yup.string().optional(),
    logoId: Yup.string().optional(),

    shipping: Yup.object().shape({
        shortDescription: Yup.string().optional(),
        faq: Yup.array().of(
            Yup.object().shape({
                question: Yup.string().optional(),
                answer: Yup.string().optional(),
            })
        ),
    }),

    isActive: Yup.boolean().required(),
});