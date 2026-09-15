"use client"

import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { X } from "lucide-react";

import { AddRedirectPathModalProps, UpdateBrandRedirectPathPayload } from "../../brand.types";

import { CategoryDataType } from "@/modules/category/category.types";
import { MainCategoryDataType } from "@/modules/mainCategory/mainCategory.types";
import { SubCategoryDataType } from "@/modules/subCategory/subCategory.types";
import { LeafCategoryDataType } from "@/modules/leafCategory/leafCategory.types";
import { getCategories } from "@/modules/category/category.service";
import { getMainCategoryByCategory } from "@/modules/mainCategory/mainCategory.service";
import { getSubCategoryByMainCategory } from "@/modules/subCategory/subCategory.service";
import { getLeafCategoryBySubCategory } from "@/modules/leafCategory/leafCategory.service";


export const AddRedirectPathModal: React.FC<AddRedirectPathModalProps> = ({
    isOpen,
    onClose,
    brand,
    onSubmit,
}) => {
    const [categories, setCategories] = useState<CategoryDataType[]>([]);
    const [mainCategories, setMainCategories] = useState<MainCategoryDataType[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryDataType[]>([]);
    const [leafCategories, setLeafCategories] = useState<LeafCategoryDataType[]>([]);
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    // Fetch root categories and pre-populate nested category options on open
    useEffect(() => {
        if (!isOpen || !brand) return;

        const loadCategoryHierarchy = async () => {
            try {
                setIsDataLoading(true);
                setMainCategories([]);
                setSubCategories([]);
                setLeafCategories([]);

                // 1. Fetch Root Categories
                const catRes = await getCategories(1, 100);
                if (catRes?.success) {
                    setCategories(catRes.categories || []);
                }

                // 2. Fetch Main Categories if categoryId exists
                if (brand.categoryId && Number(brand.categoryId) > 0) {
                    const mainRes = await getMainCategoryByCategory({
                        categoryId: Number(brand.categoryId),
                    });
                    if (mainRes?.success) setMainCategories(mainRes.mainCategories || []);
                }

                // 3. Fetch Sub Categories if mainCategoryId exists
                if (brand.mainCategoryId && Number(brand.mainCategoryId) > 0) {
                    const subRes = await getSubCategoryByMainCategory({
                        mainCategoryId: Number(brand.mainCategoryId),
                    });
                    if (subRes?.success) setSubCategories(subRes.subCategories || []);
                }

                // 4. Fetch Leaf Categories if subCategoryId exists
                if (brand.subCategoryId && Number(brand.subCategoryId) > 0) {
                    const leafRes = await getLeafCategoryBySubCategory({
                        subCategoryId: Number(brand.subCategoryId),
                    });
                    if (leafRes?.success) setLeafCategories(leafRes.leafCategories || []);
                }
            } catch (error) {
                console.error("Error loading category hierarchy:", error);
            } finally {
                setIsDataLoading(false);
            }
        };

        loadCategoryHierarchy();
    }, [isOpen, brand]);

    if (!isOpen) return null;

    const initialValues: UpdateBrandRedirectPathPayload = {
        id: brand.id,
        categoryId: brand.categoryId || 0,
        mainCategoryId: brand.mainCategoryId || 0,
        subCategoryId: brand.subCategoryId || 0,
        leafCategoryId: brand.leafCategoryId || 0,
    };

    const handleFormSubmit = async (
        values: UpdateBrandRedirectPathPayload,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        try {
            await onSubmit({
                id: brand.id,
                categoryId: Number(values.categoryId) || 0,
                mainCategoryId: Number(values.mainCategoryId) || 0,
                subCategoryId: Number(values.subCategoryId) || 0,
                leafCategoryId: Number(values.leafCategoryId) || 0,
            });
            onClose();
        } catch (error) {
            console.error("Failed to update redirect path:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Update Redirect Path</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={initialValues}
                    enableReinitialize
                    onSubmit={handleFormSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form>
                            <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                                {/* Category Selection */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">
                                        Category
                                    </label>
                                    <Field
                                        as="select"
                                        name="categoryId"
                                        className="w-full border border-gray-300 rounded-md p-2 text-xs bg-white focus:outline-none focus:border-black"
                                        onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
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
                                                if (res?.success) setMainCategories(res.mainCategories || []);
                                            }
                                        }}
                                    >
                                        <option value={0}>Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                {/* Main Category Selection */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">
                                        Main Category
                                    </label>
                                    <Field
                                        as="select"
                                        name="mainCategoryId"
                                        disabled={!values.categoryId || Number(values.categoryId) === 0}
                                        className="w-full border border-gray-300 rounded-md p-2 text-xs bg-white focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const mainId = Number(e.target.value);
                                            setFieldValue("mainCategoryId", mainId);
                                            setFieldValue("subCategoryId", 0);
                                            setFieldValue("leafCategoryId", 0);

                                            setSubCategories([]);
                                            setLeafCategories([]);

                                            if (mainId > 0) {
                                                const res = await getSubCategoryByMainCategory({ mainCategoryId: mainId });
                                                if (res?.success) setSubCategories(res.subCategories || []);
                                            }
                                        }}
                                    >
                                        <option value={0}>Select Main Category</option>
                                        {mainCategories.map((main) => (
                                            <option key={main.id} value={main.id}>
                                                {main.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                {/* Sub Category Selection */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">
                                        Sub Category
                                    </label>
                                    <Field
                                        as="select"
                                        name="subCategoryId"
                                        disabled={!values.mainCategoryId || Number(values.mainCategoryId) === 0}
                                        className="w-full border border-gray-300 rounded-md p-2 text-xs bg-white focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        onChange={async (e: React.ChangeEvent<HTMLSelectElement>) => {
                                            const subId = Number(e.target.value);
                                            setFieldValue("subCategoryId", subId);
                                            setFieldValue("leafCategoryId", 0);

                                            setLeafCategories([]);

                                            if (subId > 0) {
                                                const res = await getLeafCategoryBySubCategory({ subCategoryId: subId });
                                                if (res?.success) setLeafCategories(res.leafCategories || []);
                                            }
                                        }}
                                    >
                                        <option value={0}>Select Sub Category</option>
                                        {subCategories.map((sub) => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>

                                {/* Leaf Category Selection */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-700">
                                        Leaf Category
                                    </label>
                                    <Field
                                        as="select"
                                        name="leafCategoryId"
                                        disabled={!values.subCategoryId || Number(values.subCategoryId) === 0}
                                        className="w-full border border-gray-300 rounded-md p-2 text-xs bg-white focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setFieldValue("leafCategoryId", Number(e.target.value));
                                        }}
                                    >
                                        <option value={0}>Select Leaf Category</option>
                                        {leafCategories.map((leaf) => (
                                            <option key={leaf.id} value={leaf.id}>
                                                {leaf.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg w-full cursor-pointer transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg w-full cursor-pointer transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? "Saving..." : "Save Path"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};