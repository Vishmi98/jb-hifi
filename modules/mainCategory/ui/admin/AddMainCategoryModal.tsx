"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Formik, Form, FormikProps, ErrorMessage, Field } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";

import { createMainCategory } from "../../mainCategory.service";
import { getCategories } from "../../../category/category.service";
import { addMainCategoryInitialValues, addMainCategoryValidationSchema } from "../../mainCategory.utils";
import { MainCategoryDataType } from "../../mainCategory.types";

import { MAX_SIZE_MB } from "@/constants/data";
import CropModal from "@/components/ImageCropper";
import { AddModalProps } from "@/constants/types";
import { slugify } from "@/utils/slug";


const AddMainCategoryModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);

    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                if (response.success) {
                    setCategories(response.categories.map((category) => ({ id: category.id, name: category.name })));
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };

        if (isOpen) {
            void fetchCategories();
        }
    }, [isOpen]);

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
        values: MainCategoryDataType,
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
            if (!image) {
                setFieldError("image", "Image is required");
                toast.error("Please upload required image.");
                setSubmitting(false);
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append("categoryId", String(values.categoryId));
            formData.append("name", values.name);
            formData.append("mainSlug", values.mainSlug);
            formData.append("description", values.description);
            formData.append("isActive", String(values.isActive));
            formData.append("image", image);

            const response = await createMainCategory(formData);

            if (response.success) {
                toast.success(response.message);
                resetForm();
                setImage(null);
                setTimeout(() => {
                    onClose();
                    handleReload();
                }, 300);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while adding the main category.");
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
                    <h2 className="font-semibold text-lg">Add New Main Category</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={addMainCategoryInitialValues}
                    validationSchema={addMainCategoryValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue }: FormikProps<MainCategoryDataType>) => (
                        <Form>
                            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Category
                                    <Field as="select" name="categoryId" className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black">
                                        <option value="0">Select category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="categoryId" component="div" className="text-red-600 text-xs" />
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Name
                                    <Field
                                        name="name"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const name = e.target.value;
                                            setFieldValue("name", name);
                                            setFieldValue("mainSlug", slugify(name));
                                        }}
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-600 text-xs" />
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Main Slug
                                    <Field
                                        name="mainSlug"
                                        type="text"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="mainSlug" component="div" className="text-red-600 text-xs" />
                                </label>

                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Description
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full h-32 resize-none outline-none focus:border-black"
                                    />
                                    <ErrorMessage name="description" component="div" className="text-red-600 text-xs" />
                                </label>

                                <label className="text-sm font-medium flex items-center gap-2 cursor-pointer">
                                    <Field
                                        type="checkbox"
                                        name="isActive"
                                        className="rounded border-gray-300 text-black focus:ring-black w-4 h-4"
                                    />
                                    Active Main Category
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
                                                alt="Thumbnail Preview"
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
                                    cropWidth={1000}
                                    cropHeight={1000}
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

export default AddMainCategoryModal;
