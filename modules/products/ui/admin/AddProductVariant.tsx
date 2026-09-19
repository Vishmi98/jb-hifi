"use client";

import React, { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

import { AddSpecificationModalProps, ProductVariantDataType } from "../../products.types";
import { addProductVariants } from "../../products.service";
import {
    productVariantInitialValues,
    productVariantValidationSchema,
} from "../../products.utils";

import ImageCropper from "@/components/ImageCropper";
import { MAX_SIZE_MB } from "@/constants/data";


export const AddProductVariantModal: React.FC<AddSpecificationModalProps> = ({
    isOpen,
    onClose,
    product,
    reloadData,
}) => {
    // Media States
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Crop Modal States
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(`Please upload an image smaller than ${MAX_SIZE_MB} MB.`);
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
        values: ProductVariantDataType,
        {
            resetForm,
            setSubmitting,
        }: {
            resetForm: () => void;
            setSubmitting: (isSubmitting: boolean) => void;
        }
    ) => {
        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("productId", String(product?.id));
            

            if (image) {
                formData.append("file", image);
            }

            const response = await addProductVariants(formData);

            if (response?.success) {
                toast.success(response.message || "Variant added successfully!");
                resetForm();
                setImage(null);
                setTimeout(() => {
                    onClose();
                    reloadData();
                }, 300);
            } else {
                toast.error(response?.message || "Failed to add variant.");
            }
        } catch (error) {
            toast.error("An error occurred while adding the product variant.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col mx-3"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div>
                        <h2 className="font-semibold text-lg">Add Product Variant</h2>
                        {product?.title && (
                            <p className="text-xs text-gray-500 font-medium truncate max-w-md">
                                Target Product: {product?.title}
                            </p>
                        )}
                    </div>
                    <X
                        className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black"
                        onClick={onClose}
                    />
                </div>

                <Formik
                    initialValues={productVariantInitialValues}
                    validationSchema={productVariantValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, isSubmitting }: FormikProps<ProductVariantDataType>) => (
                        <Form className="flex flex-col overflow-hidden">
                            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4">
                                {/* Model & SKU */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Product Model
                                        <Field
                                            name="productModel"
                                            type="text"
                                            placeholder="e.g. Model X / Pro"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                        <ErrorMessage
                                            name="productModel"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Variant SKU
                                        <Field
                                            name="sku"
                                            type="text"
                                            placeholder="e.g. PROD-RED-XL"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                        <ErrorMessage
                                            name="sku"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>
                                </div>

                                {/* Pricing & Stock */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Price
                                        <Field
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                        <ErrorMessage
                                            name="price"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Original Price
                                        <Field
                                            name="originalPrice"
                                            type="number"
                                            step="0.01"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                        <ErrorMessage
                                            name="originalPrice"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Stock Count
                                        <Field
                                            name="stockCount"
                                            type="number"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                        <ErrorMessage
                                            name="stockCount"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>
                                </div>

                                {/* Color Name & Color Hex Code */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Color Name
                                        <Field
                                            name="color"
                                            type="text"
                                            placeholder="e.g. Midnight Blue"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                        <ErrorMessage
                                            name="color"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Color HEX Code
                                        <div className="flex gap-2 items-center">
                                            <Field
                                                name="colorHexCode"
                                                type="text"
                                                placeholder="#FF0000"
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                            />
                                            {/* Native Color Picker Sync */}
                                            <input
                                                type="color"
                                                value={
                                                    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(values.colorHexCode)
                                                        ? values.colorHexCode
                                                        : "#000000"
                                                }
                                                onChange={(e) => setFieldValue("colorHexCode", e.target.value)}
                                                className="w-9 h-9 border p-0.5 rounded cursor-pointer shrink-0"
                                            />
                                        </div>
                                        <ErrorMessage
                                            name="colorHexCode"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>
                                </div>

                                {/* Variant Image Upload */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Variant Image (≤ {MAX_SIZE_MB} MB)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                    />
                                    {image && (
                                        <div className="mt-2 relative w-28 h-28 border rounded overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(image)}
                                                alt="Variant Image Preview"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Crop Modal Window */}
                            {isCropOpen && tempImageFile && (
                                <ImageCropper
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={1000}
                                    cropHeight={1000}
                                />
                            )}

                            {/* Form Action Buttons */}
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
                                    className="px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg w-full cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {(isLoading || isSubmitting) && (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    )}
                                    {isLoading || isSubmitting ? "Adding..." : "Add Variant"}
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