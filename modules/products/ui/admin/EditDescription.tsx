"use client";

import React, { useState } from "react";
import { Field, FieldArray, Form, Formik, ErrorMessage, FormikProps } from "formik";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Or your preferred toast provider

import { DescriptionDataType, EditDescriptionModalProps } from "../../products.types";
import { updateDescription } from "../../products.service";
import { addProductDescriptionValidationSchema, featureInitialValues } from "../../products.utils";


export const EditDescriptionModal: React.FC<EditDescriptionModalProps> = ({ isOpen, product, onClose, initialValues, reloadData }) => {
    // Media States
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (
        values: DescriptionDataType,
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
            if (product?.id) {
                formData.append("productId", String(product.id));
            }
            if (values.paragraph1) formData.append("paragraph1", values.paragraph1);
            if (values.paragraph2) formData.append("paragraph2", values.paragraph2);
            if (values.paragraph3) formData.append("paragraph3", values.paragraph3);
            if (values.videoUrl) formData.append("videoUrl", values.videoUrl);

            // Serialize key features array into JSON string
            if (values.features && values.features.length > 0) {
                formData.append("features", JSON.stringify(values.features));
            }

            const response = await updateDescription(formData);

            if (response?.success) {
                toast.success(response.message || "Description updated successfully!");
                resetForm();
                setTimeout(() => {
                    onClose();
                    reloadData();
                }, 300);
            } else {
                toast.error(response?.message || "Failed to update description.");
            }
        } catch (error) {
            toast.error("An error occurred while updating the description.");
            console.error(error);
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
                        <h2 className="font-semibold text-lg">Edit Description</h2>
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
                    validationSchema={addProductDescriptionValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting }: FormikProps<DescriptionDataType>) => (
                        <Form className="flex flex-col overflow-hidden">
                            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4">

                                {/* Paragraph 1 */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Primary Paragraph (Paragraph 1)
                                    <Field
                                        as="textarea"
                                        name="paragraph1"
                                        rows={3}
                                        placeholder="Write main detailed description..."
                                        className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black resize-y"
                                    />
                                    <ErrorMessage
                                        name="paragraph1"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Paragraph 2 & 3 Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Paragraph 2 (Optional)
                                        <Field
                                            as="textarea"
                                            name="paragraph2"
                                            rows={3}
                                            placeholder="Additional paragraph..."
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black resize-y"
                                        />
                                        <ErrorMessage
                                            name="paragraph2"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Paragraph 3 (Optional)
                                        <Field
                                            as="textarea"
                                            name="paragraph3"
                                            rows={3}
                                            placeholder="Further information..."
                                            className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black resize-y"
                                        />
                                        <ErrorMessage
                                            name="paragraph3"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>
                                </div>

                                {/* Video URL */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Video URL (Optional)
                                    <Field
                                        name="videoUrl"
                                        type="url"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        className="border border-gray-300 rounded-md text-sm p-2 w-full outline-none focus:border-black"
                                    />
                                    <ErrorMessage
                                        name="videoUrl"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                </label>

                                {/* Dynamic Key Features Section */}
                                <div className="flex flex-col gap-3 border-t pt-3">
                                    <span className="text-sm font-medium text-gray-700">
                                        Key Features
                                    </span>
                                    <FieldArray name="features">
                                        {({ push, remove }) => (
                                            <div className="flex flex-col gap-3">
                                                {values.features &&
                                                    values.features.map((_, index) => (
                                                        <div
                                                            key={index}
                                                            className="p-3 border rounded-lg bg-gray-50/50 flex flex-col gap-2 relative"
                                                        >
                                                            <div className="flex justify-between items-center border-b pb-1 mb-1">
                                                                <span className="text-xs font-semibold text-gray-500">
                                                                    Feature #{index + 1}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(index)}
                                                                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                                    title="Remove Feature"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            {/* Title Input */}
                                                            <div className="flex flex-col gap-1">
                                                                <Field
                                                                    name={`features.${index}.title`}
                                                                    placeholder="Title (e.g., Water Resistance)"
                                                                    className="border border-gray-300 rounded-md text-sm p-2 outline-none focus:border-black bg-white"
                                                                />
                                                                <ErrorMessage
                                                                    name={`features.${index}.title`}
                                                                    component="div"
                                                                    className="text-red-600 text-xs"
                                                                />
                                                            </div>

                                                            {/* Description Input */}
                                                            <div className="flex flex-col gap-1">
                                                                <Field
                                                                    as="textarea"
                                                                    rows={2}
                                                                    name={`features.${index}.description`}
                                                                    placeholder="Description (e.g., IP68 rated up to 50m underwater)"
                                                                    className="border border-gray-300 rounded-md text-sm p-2 outline-none focus:border-black bg-white resize-y"
                                                                />
                                                                <ErrorMessage
                                                                    name={`features.${index}.description`}
                                                                    component="div"
                                                                    className="text-red-600 text-xs"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}

                                                <button
                                                    type="button"
                                                    onClick={() => push({ ...featureInitialValues })}
                                                    className="self-start flex items-center gap-1 text-xs font-semibold text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors mt-1 cursor-pointer"
                                                >
                                                    <Plus className="w-3.5 h-3.5" /> Add Feature
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>

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