"use client";

import React, { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps, FieldArray } from "formik";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";

import { EditProductVariantModalProps, ProductVariantDataType } from "../../products.types";
import { updateProductVariant } from "../../products.service";
import {
    productSpecificationInitialValues,
    productVariantValidationSchema,
} from "../../products.utils";

import ImageCropper from "@/components/ImageCropper";
import { MAX_SIZE_MB } from "@/constants/data";


export const EditProductVariantModal: React.FC<EditProductVariantModalProps> = ({ isOpen, onClose, initialValues, reloadData, product }) => {
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
        if (!initialValues?.id) {
            toast.error("Invalid variant data.");
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("variantId", String(initialValues.id));
            if (product?.id) {
                formData.append("productId", String(product.id));
            }
            formData.append("productModel", values.productModel);
            formData.append("sku", values.sku);
            formData.append("price", String(values.price));
            formData.append("originalPrice", String(values.originalPrice));
            formData.append("additionalPrice", String(values.additionalPrice || 0));
            formData.append("stockCount", String(values.stockCount));
            formData.append("color", values.color);
            formData.append("colorHexCode", values.colorHexCode);

            // Pass specifications array as serialized JSON string
            formData.append("specifications", JSON.stringify(values.specifications || []));

            if (image) {
                formData.append("variantImage", image);
            }

            // Call API update action endpoint
            const response = await updateProductVariant(formData);

            if (response?.success) {
                toast.success(response.message || "Variant updated successfully!");
                resetForm();
                setImage(null);
                setTimeout(() => {
                    onClose();
                    reloadData();
                }, 300);
            } else {
                toast.error(response?.message || "Failed to update variant.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the product variant.");
            console.error("Submission Error: ", error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen || !initialValues) return null;

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
                        <h2 className="font-semibold text-lg">Update Product Variant</h2>
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
                    initialValues={initialValues}
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
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
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
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
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
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
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
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
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
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
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
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
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
                                                className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
                                            />
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

                                {/* Dynamic Specifications Section */}
                                <div className="flex flex-col gap-2 border-t pt-3">
                                    <span className="text-sm font-medium text-gray-700">Variant Specifications</span>
                                    <FieldArray name="specifications">
                                        {({ push, remove }) => (
                                            <div className="flex flex-col gap-2">
                                                {values.specifications.map((_, index) => (
                                                    <div key={index} className="flex gap-2 items-start">
                                                        <div className="flex-1 flex flex-col">
                                                            <Field
                                                                name={`specifications.${index}.name`}
                                                                placeholder="Spec Name (e.g. RAM)"
                                                                className="border border-gray-300 rounded-md text-sm p-2 outline-none focus:border-black"
                                                            />
                                                            <ErrorMessage
                                                                name={`specifications.${index}.name`}
                                                                component="div"
                                                                className="text-red-600 text-xs"
                                                            />
                                                        </div>
                                                        <div className="flex-1 flex flex-col">
                                                            <Field
                                                                name={`specifications.${index}.value`}
                                                                placeholder="Spec Value (e.g. 16GB)"
                                                                className="border border-gray-300 rounded-md text-sm p-2 outline-none focus:border-black"
                                                            />
                                                            <ErrorMessage
                                                                name={`specifications.${index}.value`}
                                                                component="div"
                                                                className="text-red-600 text-xs"
                                                            />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="p-2 text-red-500 hover:text-red-700 border border-gray-200 hover:bg-red-50 rounded-md transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => push(productSpecificationInitialValues)}
                                                    className="self-start flex items-center gap-1 text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors mt-1"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
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
                                    {image ? (
                                        <Image
                                            src={URL.createObjectURL(image)}
                                            alt="Thumbnail Preview"
                                            width={150}
                                            height={150}
                                            className="mt-2"
                                        />
                                    ) : initialValues.imagePath ? (
                                        <Image
                                            src={initialValues.imagePath}
                                            alt="Thumbnail Preview"
                                            width={150}
                                            height={150}
                                            className="mt-2"
                                        />
                                    ) : null}
                                </label>
                            </div>

                            {/* Image Crop Modal Wrapper */}
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
                                    {isLoading || isSubmitting ? "Updating..." : "Update"}
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