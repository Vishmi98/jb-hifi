"use client";

import React, { FC, useState } from "react";
import Image from "next/image";
import { Formik, Form, FormikProps, ErrorMessage, Field } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";

import { updateCategory } from "../../category.service";
import { addCategoryValidationSchema } from "../../category.utils";
import { CategoryDataType, EditCategoryModalProps } from "../../category.types";

import { MAX_SIZE_MB } from "@/constants/data";
import CropModal from "@/components/ImageCropper";
import { slugify } from "@/utils/slug";


const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ isOpen, onClose, initialValues, reloadData }) => {
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Crop modal state
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    // Image change handler
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

    // Cropping complete handler
    const handleCropComplete = (croppedFile: File) => {
        setImage(croppedFile);
        setTempImageFile(null);
        setIsCropOpen(false);
    };

    const handleSubmit = async (
        values: CategoryDataType,
        {
            resetForm,
            setSubmitting,
        }: {
            resetForm: () => void;
            setSubmitting: (isSubmitting: boolean) => void;
        }
    ) => {
        if (!initialValues) return;

        try {
            setIsLoading(true);

            const formData = new FormData();
            formData.append("id", String(initialValues.id));
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("description", values.description);
            formData.append("isActive", String(values.isActive));

            if (image) {
                formData.append("image", image);
            }

            const response = await updateCategory(formData);

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
            toast.error("An error occurred while updating the category.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    if (!isOpen || !initialValues) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Edit Category</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={addCategoryValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }: FormikProps<CategoryDataType>) => (
                        <Form>
                            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                                {/* Name */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Name
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
                                    <ErrorMessage name="name" component="div" className="text-red-600 text-xs" />
                                </label>

                                {/* Slug */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Slug
                                    <Field
                                        name="slug"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="slug" component="div" className="text-red-600 text-xs" />
                                </label>

                                {/* Description */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Description
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full h-32 resize-none outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="description" component="div" className="text-red-600 text-xs" />
                                </label>

                                {/* Is Active Toggle */}
                                <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                                    <Field
                                        type="checkbox"
                                        name="isActive"
                                        className="rounded border-gray-300 text-black focus:ring-black w-4 h-4"
                                    />
                                    Active Category
                                </label>

                                {/* Thumbnail Image */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Image (≤ 1.1 MB)
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3
                                          file:rounded-md file:border file:text-xs file:font-semibold
                                          file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
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

                            {/* Crop Modal */}
                            {isCropOpen && tempImageFile && (
                                <CropModal
                                    imageFile={tempImageFile}
                                    onCropComplete={handleCropComplete}
                                    onClose={() => setIsCropOpen(false)}
                                    cropWidth={1000}
                                    cropHeight={1000}
                                />
                            )}

                            {/* Actions */}
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
                                    {isLoading ? "Updating..." : "Update"}
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

export default EditCategoryModal;