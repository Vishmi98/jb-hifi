"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Formik, Form, FormikProps, ErrorMessage, Field } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import * as Yup from "yup";

import { getBrands } from "@/modules/brand/brand.service";
import { getCategories } from "@/modules/category/category.service";
import { getMainCategoryByCategory } from "@/modules/mainCategory/mainCategory.service";
import { getSubCategoryByMainCategory } from "@/modules/subCategory/subCategory.service";
import { getLeafCategoryBySubCategory } from "@/modules/leafCategory/leafCategory.service";
import { addBannerItem } from "../../bannerCollection.service";
import { BannerCollectionDataType } from "../../bannerCollection.types";

import { MAX_SIZE_MB } from "@/constants/data";
import CropModal from "@/components/ImageCropper";

type AddBannerItemModalProps = {
    isOpen: boolean;
    onClose: () => void;
    bannerCollection: BannerCollectionDataType;
    reloadData: () => void;
};

const AddBannerItemModal: FC<AddBannerItemModalProps> = ({
    isOpen,
    onClose,
    bannerCollection,
    reloadData,
}) => {
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [mainCategories, setMainCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [subCategories, setSubCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [leafCategories, setLeafCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [brands, setBrands] = useState<Array<{ id: number; name: string }>>([]);

    const [isFetchingMainCategories, setIsFetchingMainCategories] = useState(false);
    const [isFetchingSubCategories, setIsFetchingSubCategories] = useState(false);
    const [isFetchingLeafCategories, setIsFetchingLeafCategories] = useState(false);

    const getInitialValues = () => ({
        categoryId: 0,
        mainCategoryId: 0,
        subCategoryId: 0,
        leafCategoryId: 0,
        brandId: 0,
        productId: "",
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await getBrands();
                if (response.success && response.brands) {
                    setBrands(
                        response.brands.map((brand) => ({
                            id: brand.id,
                            name: brand.name,
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch brands", error);
            }

            try {
                const response = await getCategories();
                if (response.success && response.categories) {
                    setCategories(
                        response.categories.map((cat) => ({
                            id: cat.id,
                            name: cat.name,
                        }))
                    );
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        if (isOpen) {
            void fetchOptions();
        }
    }, [isOpen]);

    const handleCategoryChange = async (categoryId: number, setFieldValue: any) => {
        setFieldValue("categoryId", categoryId);
        setFieldValue("mainCategoryId", 0);
        setFieldValue("subCategoryId", 0);
        setFieldValue("leafCategoryId", 0);
        setMainCategories([]);
        setSubCategories([]);
        setLeafCategories([]);

        if (!categoryId || categoryId === 0) return;

        try {
            setIsFetchingMainCategories(true);
            const response = await getMainCategoryByCategory({ categoryId });
            if (response.success && response.mainCategories) {
                setMainCategories(
                    response.mainCategories.map((mainCat) => ({
                        id: mainCat.id,
                        name: mainCat.name,
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to fetch main categories", error);
        } finally {
            setIsFetchingMainCategories(false);
        }
    };

    const handleMainCategoryChange = async (mainCategoryId: number, setFieldValue: any) => {
        setFieldValue("mainCategoryId", mainCategoryId);
        setFieldValue("subCategoryId", 0);
        setFieldValue("leafCategoryId", 0);
        setSubCategories([]);
        setLeafCategories([]);

        if (!mainCategoryId || mainCategoryId === 0) return;

        try {
            setIsFetchingSubCategories(true);
            const response = await getSubCategoryByMainCategory({ mainCategoryId });
            if (response.success && response.subCategories) {
                setSubCategories(
                    response.subCategories.map((subCat) => ({
                        id: subCat.id,
                        name: subCat.name,
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to fetch sub categories", error);
        } finally {
            setIsFetchingSubCategories(false);
        }
    };

    const handleSubCategoryChange = async (subCategoryId: number, setFieldValue: any) => {
        setFieldValue("subCategoryId", subCategoryId);
        setFieldValue("leafCategoryId", 0);
        setLeafCategories([]);

        if (!subCategoryId || subCategoryId === 0) return;

        try {
            setIsFetchingLeafCategories(true);
            const response = await getLeafCategoryBySubCategory({ subCategoryId });
            if (response.success && response.leafCategories) {
                setLeafCategories(
                    response.leafCategories.map((leafCat) => ({
                        id: leafCat.id,
                        name: leafCat.name,
                    }))
                );
            }
        } catch (error) {
            console.error("Failed to fetch leaf categories", error);
        } finally {
            setIsFetchingLeafCategories(false);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setImage(croppedFile);
        setTempImageFile(null);
        setIsCropOpen(false);
    };

    const handleSubmit = async (
        values: ReturnType<typeof getInitialValues>,
        {
            resetForm,
            setSubmitting,
        }: {
            resetForm: () => void;
            setSubmitting: (isSubmitting: boolean) => void;
        }
    ) => {
        if (!image) {
            toast.error("Please upload an image for the banner item.");
            setSubmitting(false);
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("bannerId", String(bannerCollection.id));
            formData.append("image", image);

            if (values.categoryId > 0) formData.append("categoryId", String(values.categoryId));
            if (values.mainCategoryId > 0) formData.append("mainCategoryId", String(values.mainCategoryId));
            if (values.subCategoryId > 0) formData.append("subCategoryId", String(values.subCategoryId));
            if (values.leafCategoryId > 0) formData.append("leafCategoryId", String(values.leafCategoryId));
            if (values.brandId > 0) formData.append("brandId", String(values.brandId));
            if (values.productId) formData.append("productId", String(values.productId));

            const response = await addBannerItem(formData);

            if (response.success) {
                toast.success(response.message);
                resetForm();
                setImage(null);
                setTimeout(() => {
                    onClose();
                    reloadData();
                }, 300);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the banner item.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    const validationSchema = Yup.object({
        productId: Yup.string().when([], {
            is: () => bannerCollection.bannerType === "product",
            then: (schema) => schema.required("Product ID is required"),
            otherwise: (schema) => schema.notRequired(),
        }),
    });

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add Banner Item</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={getInitialValues()}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ setFieldValue, values }: FormikProps<ReturnType<typeof getInitialValues>>) => (
                        <Form>
                            <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto p-4">
                                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
                                    <span className="font-semibold text-gray-800">Banner Type:</span> {bannerCollection.bannerType}
                                </div>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Category
                                    <Field
                                        as="select"
                                        name="categoryId"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const categoryId = Number(e.target.value);
                                            void handleCategoryChange(categoryId, setFieldValue);
                                        }}
                                    >
                                        <option value={0}>Select category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Main Category
                                    <Field
                                        as="select"
                                        name="mainCategoryId"
                                        disabled={!values.categoryId || isFetchingMainCategories}
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const mainCategoryId = Number(e.target.value);
                                            void handleMainCategoryChange(mainCategoryId, setFieldValue);
                                        }}
                                    >
                                        <option value={0}>
                                            {isFetchingMainCategories ? "Loading main categories..." : "Select main category"}
                                        </option>
                                        {mainCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Sub Category
                                    <Field
                                        as="select"
                                        name="subCategoryId"
                                        disabled={!values.mainCategoryId || isFetchingSubCategories}
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const subCategoryId = Number(e.target.value);
                                            void handleSubCategoryChange(subCategoryId, setFieldValue);
                                        }}
                                    >
                                        <option value={0}>
                                            {isFetchingSubCategories ? "Loading sub categories..." : "Select sub category"}
                                        </option>
                                        {subCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Leaf Category
                                    <Field
                                        as="select"
                                        name="leafCategoryId"
                                        disabled={!values.subCategoryId || isFetchingLeafCategories}
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value={0}>
                                            {isFetchingLeafCategories ? "Loading leaf categories..." : "Select leaf category"}
                                        </option>
                                        {leafCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Brand
                                    <Field
                                        as="select"
                                        name="brandId"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    >
                                        <option value={0}>Select brand</option>
                                        {brands.map((brand) => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </Field>
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Product ID
                                    <Field
                                        name="productId"
                                        type="number"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="productId" component="div" className="text-red-600 text-xs" />
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Image (≤ 1.1 MB)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                    />
                                    {image && (
                                        <div className="mt-2 relative w-36 h-36 border rounded overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(image)}
                                                alt="Item Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </label>
                            </div>

                            {isCropOpen && tempImageFile && (
                                <CropModal
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={2550}
                                    cropHeight={850}
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
                                    {isLoading ? "Adding..." : "Add Item"}
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

export default AddBannerItemModal;