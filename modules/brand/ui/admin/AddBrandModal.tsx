
"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Formik, Form, FormikProps, ErrorMessage, Field } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { Loader2, X } from "lucide-react";

import { createBrand } from "../../brand.service";
import { addBrandInitialValues, addBrandValidationSchema } from "../../brand.utils";
import { BrandDataType } from "../../brand.types";

import { MAX_SIZE_MB } from "@/constants/data";
import CropModal from "@/components/ImageCropper";
import { AddModalProps } from "@/constants/types";
import { slugify } from "@/utils/slug";
import { CategoryDataType } from "@/modules/category/category.types";
import { MainCategoryDataType } from "@/modules/mainCategory/mainCategory.types";
import { SubCategoryDataType } from "@/modules/subCategory/subCategory.types";
import { LeafCategoryDataType } from "@/modules/leafCategory/leafCategory.types";
import { getMainCategoryByCategory } from "@/modules/mainCategory/mainCategory.service";
import { getSubCategoryByMainCategory } from "@/modules/subCategory/subCategory.service";
import { getLeafCategoryBySubCategory } from "@/modules/leafCategory/leafCategory.service";
import { getCategories } from "@/modules/category/category.service";


const AddBrandModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    // Media States
    const [logo, setLogo] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<CategoryDataType[]>([]);
    const [mainCategories, setMainCategories] = useState<MainCategoryDataType[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryDataType[]>([]);
    const [leafCategories, setLeafCategories] = useState<LeafCategoryDataType[]>([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    // Crop Modal States
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchCategories = async () => {
                setIsCategoryLoading(true);
                try {
                    const res = await getCategories();
                    if (res?.success) {
                        setCategories(res.categories || []);
                    }
                } catch (error) {
                    toast.error("Failed to fetch top-level categories.");
                    console.error(error);
                } finally {
                    setIsCategoryLoading(false);
                }
            };
            fetchCategories();
        }
    }, [isOpen]);

    // File Upload Handlers
    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_SIZE_MB) {
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

    // Submit Handler
    const handleSubmit = async (
        values: BrandDataType,
        {
            resetForm,
            setSubmitting,
            setFieldError,
        }: {
            resetForm: () => void;
            setSubmitting: (isSubmitting: boolean) => void;
            setFieldError: (field: string, message: string) => void;
        }
    ) => {
        try {
            if (!logo) {
                setFieldError("logo", "Logo is required");
                toast.error("Please upload required brand logo.");
                setSubmitting(false);
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("shortDescription", values.shortDescription || "");
            formData.append("videoLink", values.videoLink || "");
            formData.append("haveSinglePage", String(values.haveSinglePage));
            formData.append("logo", logo);

            // Append category selection only if haveSinglePage is disabled
            if (!values.haveSinglePage) {
                if (values.categoryId) formData.append("categoryId", String(values.categoryId));
                if (values.mainCategoryId) formData.append("mainCategoryId", String(values.mainCategoryId));
                if (values.subCategoryId) formData.append("subCategoryId", String(values.subCategoryId));
                if (values.leafCategoryId) formData.append("leafCategoryId", String(values.leafCategoryId));
            }

            const response = await createBrand(formData);

            if (response.success) {
                toast.success(response.message || "Brand created successfully!");
                resetForm();
                setLogo(null);
                setTimeout(() => {
                    onClose();
                    handleReload();
                }, 300);
            } else {
                toast.error(response.message || "Failed to add brand.");
            }
        } catch (error) {
            toast.error("An error occurred while adding the brand.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add New Brand</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={addBrandInitialValues}
                    validationSchema={addBrandValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }: FormikProps<BrandDataType>) => (
                        <Form>
                            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                                {/* Brand Name */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Name *
                                    <Field
                                        name="name"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const name = e.target.value;
                                            setFieldValue("name", name);
                                            setFieldValue("slug", slugify(name));
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

                                {/* Short Description */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Short Description
                                    <Field
                                        as="textarea"
                                        name="shortDescription"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full h-20 resize-none outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="shortDescription"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Video Link */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Video Link
                                    <Field
                                        name="videoLink"
                                        type="text"
                                        placeholder="https://youtube.com/watch?v=..."
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="videoLink"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Have Single Page Checkbox Toggle */}
                                <label className="flex items-center gap-2 cursor-pointer pt-2">
                                    <Field
                                        type="checkbox"
                                        name="haveSinglePage"
                                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        Have Single Page (Disable Category Path)
                                    </span>
                                </label>

                                {/* Conditional Category Select Boxes */}
                                {values.haveSinglePage === false ? (
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex flex-col gap-3 mt-1 relative">
                                        <div className="flex justify-between items-center">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                Category Hierarchy
                                            </h4>
                                            {isCategoryLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-500" />}
                                        </div>

                                        {/* Category Select */}
                                        <label className="text-sm font-medium flex flex-col gap-1">
                                            Category
                                            <select
                                                name="categoryId"
                                                value={values.categoryId || 0}
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black"
                                                onChange={async (e) => {
                                                    const catId = Number(e.target.value);
                                                    setFieldValue("categoryId", catId);
                                                    setFieldValue("mainCategoryId", 0);
                                                    setFieldValue("subCategoryId", 0);
                                                    setFieldValue("leafCategoryId", 0);
                                                    setMainCategories([]);
                                                    setSubCategories([]);
                                                    setLeafCategories([]);

                                                    if (catId > 0) {
                                                        const res = await getMainCategoryByCategory({ categoryId: catId });
                                                        if (res.success) setMainCategories(res.mainCategories);
                                                    }
                                                }}
                                            >
                                                <option value={0}>Select Category</option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id}>
                                                        {cat.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Main Category Select */}
                                        <label className="text-sm font-medium flex flex-col gap-1">
                                            Main Category
                                            <select
                                                name="mainCategoryId"
                                                value={values.mainCategoryId || 0}
                                                disabled={!values.categoryId || values.categoryId === 0}
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                onChange={async (e) => {
                                                    const mainId = Number(e.target.value);
                                                    setFieldValue("mainCategoryId", mainId);
                                                    setFieldValue("subCategoryId", 0);
                                                    setFieldValue("leafCategoryId", 0);
                                                    setSubCategories([]);
                                                    setLeafCategories([]);

                                                    if (mainId > 0) {
                                                        const res = await getSubCategoryByMainCategory({ mainCategoryId: mainId });
                                                        if (res.success) setSubCategories(res.subCategories);
                                                    }
                                                }}
                                            >
                                                <option value={0}>Select Main Category</option>
                                                {mainCategories.map((main) => (
                                                    <option key={main.id} value={main.id}>
                                                        {main.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Sub Category Select */}
                                        <label className="text-sm font-medium flex flex-col gap-1">
                                            Sub Category
                                            <select
                                                name="subCategoryId"
                                                value={values.subCategoryId || 0}
                                                disabled={!values.mainCategoryId || values.mainCategoryId === 0}
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                onChange={async (e) => {
                                                    const subId = Number(e.target.value);
                                                    setFieldValue("subCategoryId", subId);
                                                    setFieldValue("leafCategoryId", 0);
                                                    setLeafCategories([]);

                                                    if (subId > 0) {
                                                        const res = await getLeafCategoryBySubCategory({ subCategoryId: subId });
                                                        if (res.success) setLeafCategories(res.leafCategories);
                                                    }
                                                }}
                                            >
                                                <option value={0}>Select Sub Category</option>
                                                {subCategories.map((sub) => (
                                                    <option key={sub.id} value={sub.id}>
                                                        {sub.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        {/* Leaf Category Select */}
                                        <label className="text-sm font-medium flex flex-col gap-1">
                                            Leaf Category
                                            <select
                                                name="leafCategoryId"
                                                value={values.leafCategoryId || 0}
                                                disabled={!values.subCategoryId || values.subCategoryId === 0}
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                onChange={(e) => {
                                                    setFieldValue("leafCategoryId", Number(e.target.value));
                                                }}
                                            >
                                                <option value={0}>Select Leaf Category</option>
                                                {leafCategories.map((leaf) => (
                                                    <option key={leaf.id} value={leaf.id}>
                                                        {leaf.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>
                                ) : null}

                                {/* Logo Upload */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Logo (≤ 1.1 MB) *
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                    />
                                    <ErrorMessage
                                        name="logo"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                    {logo && (
                                        <div className="mt-2 relative w-28 h-28 border rounded overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(logo)}
                                                alt="Logo Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Crop Modal Window */}
                            {isCropOpen && tempImageFile && (
                                <CropModal
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={1000}
                                    cropHeight={700}
                                />
                            )}

                            <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
                                <button
                                    type="button"
                                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg w-full cursor-pointer transition-colors"
                                    onClick={onClose}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg w-full cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? "Adding..." : "Add"}
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

export default AddBrandModal;
