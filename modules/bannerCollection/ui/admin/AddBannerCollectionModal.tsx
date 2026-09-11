"use client";

import React, { FC, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import * as Yup from "yup";

import { createBannerCollection } from "../../bannerCollection.service";

import { AddModalProps } from "@/constants/types";

const AddBannerCollectionModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const initialValues = {
        bannerType: "",
    };

    const validationSchema = Yup.object({
        bannerType: Yup.string().required("Banner type is required"),
    });

    const handleSubmit = async (
        values: typeof initialValues,
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
            const response = await createBannerCollection({ bannerType: values.bannerType });

            if (response.success) {
                toast.success(response.message);
                resetForm();
                setTimeout(() => {
                    onClose();
                    handleReload();
                }, 300);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while creating the banner collection.");
            console.error(error);
        } finally {
            setSubmitting(false);
            setIsLoading(false);
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add New Banner Collection</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {() => (
                        <Form>
                            <div className="flex flex-col gap-4 p-4">
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Banner Type
                                    <Field
                                        as="select"
                                        name="bannerType"
                                        className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                    >
                                        <option value="">Select banner type</option>
                                        <option value="category">Category</option>
                                        <option value="main category">Main Category</option>
                                        <option value="sub category">Sub Category</option>
                                        <option value="leaf category">Leaf Category</option>
                                        <option value="brand">Brand</option>
                                        <option value="home">Home</option>
                                        <option value="product">Product</option>
                                    </Field>
                                    <ErrorMessage name="bannerType" component="div" className="text-red-600 text-xs" />
                                </label>
                            </div>

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
                                    {isLoading ? "Creating..." : "Create"}
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

export default AddBannerCollectionModal;
