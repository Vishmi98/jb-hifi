/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { FC, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps, FieldArray } from "formik";
import Image from "next/image";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

import { StoreDataType } from "../../store.types";
import { createStore } from "../../store.service";
import { addStoreInitialValues, addStoreValidationSchema } from "../../store.utils";

import { CategoryDataType } from "@/modules/category/category.types";
import { getCategories } from "@/modules/category/category.service";
import { slugify } from "@/utils/slug";
import ImageCropper from "@/components/ImageCropper";
import { AddModalProps } from "@/constants/types";
import { MAX_SIZE_MB } from "@/constants/data";


const AddStoreModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const [logo, setLogo] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    // State for fetching categories
    const [categoriesList, setCategoriesList] = useState<CategoryDataType[]>([]);
    const [isFetchingCategories, setIsFetchingCategories] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        const fetchAllCategories = async () => {
            try {
                setIsFetchingCategories(true);
                // Fetch with a higher limit to populate options in the dropdown
                const response = await getCategories();
                if (response.success) {
                    setCategoriesList(response.categories);
                } else {
                    toast.error("Failed to load categories");
                }
            } catch (error) {
                console.error("Error loading categories:", error);
                toast.error("Error fetching categories list");
            } finally {
                setIsFetchingCategories(false);
            }
        };

        fetchAllCategories();
    }, [isOpen]);

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size / (1024 * 1024) > MAX_SIZE_MB) {
            toast.error("Please upload an image smaller than 1.1 MB.");
            return;
        }

        setTempImageFile(file);
        setIsCropOpen(true);
    };

    const handleCropComplete = (croppedFile: File) => {
        setLogo(croppedFile);
        setTempImageFile(null);
        setIsCropOpen(false);
    };

    const handleSubmit = async (
        values: StoreDataType,
        {
            resetForm,
            setSubmitting,
            setFieldError,
        }: {
            resetForm: (options?: { values?: StoreDataType }) => void;
            setSubmitting: (isSubmitting: boolean) => void;
            setFieldError: (field: string, message: string) => void;
        }
    ) => {
        try {
            if (!logo) {
                setFieldError("image", "Logo is required");
                toast.error("Please upload required logo.");
                setSubmitting(false);
                return;
            }

            setIsLoading(true);
            setSubmitting(true);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("description", values.description || "");
            formData.append("website", values.website || "");
            formData.append("abn", values.abn || "");
            formData.append("annualRevenue", values.annualRevenue || "");
            formData.append("noOfEmployees", String(values.noOfEmployees ?? 0));
            formData.append("categories", JSON.stringify(values.categories || []));
            formData.append("shipping", JSON.stringify(values.shipping));

            if (logo) {
                formData.append("logo", logo);
            }

            const response = await createStore(formData);

            if (response.success) {
                toast.success(response.message || "Store created successfully!");
                resetForm({ values: addStoreInitialValues });
                setLogo(null);

                setTimeout(() => {
                    onClose();
                    handleReload();
                }, 300);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the store.");
            console.error(error);
        } finally {
            setIsLoading(false);
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add New Store</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={addStoreInitialValues}
                    validationSchema={addStoreValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, isSubmitting }: FormikProps<StoreDataType>) => (
                        <Form>
                            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                                {/* Name */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Name *
                                    <Field
                                        name="name"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            const nextValue = event.target.value;
                                            setFieldValue("name", nextValue);
                                            setFieldValue("slug", slugify(nextValue));
                                        }}
                                    />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Slug */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Slug *
                                    <Field
                                        name="slug"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="slug"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Description */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Description
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full h-20 resize-none outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Website */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Website
                                    <Field
                                        name="website"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="website"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* ABN */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    ABN
                                    <Field
                                        name="abn"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="abn"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* No. of Employees */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    No. of Employees
                                    <Field
                                        name="noOfEmployees"
                                        type="number"
                                        min={0}
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="noOfEmployees"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Annual Revenue */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Annual Revenue
                                    <Field
                                        name="annualRevenue"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="annualRevenue"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Dynamic Multi-Select Categories Dropdown */}
                                <div className="text-sm font-medium flex flex-col gap-1.5">
                                    <label htmlFor="category-select" className="text-sm font-medium text-gray-700">
                                        Categories
                                    </label>

                                    <select
                                        id="category-select"
                                        disabled={isFetchingCategories}
                                        defaultValue=""
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const selectedId = Number(e.target.value);
                                            if (!selectedId) return;

                                            const currentCategories = values.categories || [];
                                            if (!currentCategories.includes(selectedId)) {
                                                setFieldValue("categories", [...currentCategories, selectedId]);
                                            }

                                            // Reset select value to placeholder
                                            e.target.value = "";
                                        }}
                                        className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black bg-white"
                                    >
                                        <option value="" disabled>
                                            {isFetchingCategories ? "Loading categories..." : "Select a category..."}
                                        </option>
                                        {categoriesList
                                            .filter((cat) => !(values.categories || []).includes(cat.id))
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                    </select>

                                    {/* Selected Categories Badges */}
                                    {(values.categories || []).length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {(values.categories || []).map((catId) => {
                                                const category = categoriesList.find((c) => c.id === catId);
                                                return (
                                                    <span
                                                        key={catId}
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                                                    >
                                                        {category ? category.name : `ID: ${catId}`}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updatedCategories = (values.categories || []).filter(
                                                                    (id) => id !== catId
                                                                );
                                                                setFieldValue("categories", updatedCategories);
                                                            }}
                                                            className="text-gray-400 hover:text-red-600 focus:outline-none transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    )}

                                    <ErrorMessage
                                        name="categories"
                                        component="div"
                                        className="text-red-600 text-xs mt-0.5"
                                    />
                                </div>

                                {/* Shipping Details */}
                                <div className="flex flex-col gap-4">
                                    <p className="font-semibold text-sm">Shipping Details</p>

                                    <div className="text-sm font-medium flex flex-col gap-3">
                                        {/* Short Description */}
                                        <label className="flex flex-col gap-1">
                                            Short Description
                                            <Field
                                                as="textarea"
                                                name="shipping.shortDescription"
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full h-20 resize-none outline-none focus:border-black"
                                            />
                                            <ErrorMessage
                                                name="shipping.shortDescription"
                                                component="div"
                                                className="text-red-600 text-xs"
                                            />
                                        </label>

                                        {/* Dynamic FAQ List */}
                                        <FieldArray name="shipping.faq">
                                            {({ push, remove, form }) => {
                                                const faqs = form.values.shipping?.faq || [];
                                                return (
                                                    <div className="flex flex-col gap-2 border-t pt-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-xs text-gray-700">
                                                                Frequently Asked Questions
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => push({ question: "", answer: "" })}
                                                                className="text-xs text-blue-600 hover:underline font-semibold"
                                                            >
                                                                + Add FAQ
                                                            </button>
                                                        </div>

                                                        {faqs.map((_: any, index: number) => (
                                                            <div
                                                                key={index}
                                                                className="grid grid-cols-1 gap-1 p-2 border border-gray-200 rounded bg-gray-50 relative"
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <span className="text-xs font-semibold text-gray-500">
                                                                        FAQ #{index + 1}
                                                                    </span>
                                                                    {faqs.length > 1 && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => remove(index)}
                                                                            className="text-xs text-red-500 hover:underline"
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <label className="flex flex-col gap-1">
                                                                    Question
                                                                    <Field
                                                                        name={`shipping.faq.${index}.question`}
                                                                        type="text"
                                                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black bg-white"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`shipping.faq.${index}.question`}
                                                                        component="div"
                                                                        className="text-red-600 text-xs"
                                                                    />
                                                                </label>

                                                                <label className="flex flex-col gap-1">
                                                                    Answer
                                                                    <Field
                                                                        as="textarea"
                                                                        name={`shipping.faq.${index}.answer`}
                                                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full h-20 resize-none outline-none focus:border-black bg-white"
                                                                    />
                                                                    <ErrorMessage
                                                                        name={`shipping.faq.${index}.answer`}
                                                                        component="div"
                                                                        className="text-red-600 text-xs"
                                                                    />
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            }}
                                        </FieldArray>
                                    </div>
                                </div>

                                {/* Active Checkbox */}
                                <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                                    <Field
                                        type="checkbox"
                                        name="isActive"
                                        className="rounded border-gray-300 text-black focus:ring-black w-4 h-4"
                                    />
                                    Active Store
                                </label>

                                {/* Logo Upload */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Logo (&le; 1.1 MB)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                    />
                                    {logo ? (
                                        <div className="mt-2 relative w-28 h-28 border rounded overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(logo)}
                                                alt="Store Logo Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : null}
                                </label>
                            </div>

                            {/* Crop Modal */}
                            {isCropOpen && tempImageFile && (
                                <ImageCropper
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={1000}
                                    cropHeight={1000}
                                />
                            )}

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg w-full cursor-pointer transition-colors"
                                    onClick={onClose}
                                    disabled={isLoading || isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isLoading || isSubmitting}
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg w-full cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    {isLoading || isSubmitting ? "Adding..." : "Add"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddStoreModal;