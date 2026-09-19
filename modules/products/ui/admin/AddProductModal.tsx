"use client";

import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Formik, Form, FormikProps, ErrorMessage, Field } from "formik";
import { toast, ToastContainer } from "react-toastify";
import { Loader2, Plus, Trash2, X } from "lucide-react";

import { AddProductFormValues, PaymentMethodDataType, SellTypeDataType, TagLineDataType } from "../../products.types";
import { createProduct, getPaymentMethods, getSellTypes, getTagLines } from "../../products.service";
import { addFullProductInitialValues, addFullProductValidationSchema } from "../../products.utils";

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
import { BrandDataType } from "@/modules/brand/brand.types";
import { StoreDataType } from "@/modules/store/store.types";
import { getBrands } from "@/modules/brand/brand.service";
import { getStores } from "@/modules/store/store.service";


const AddProductModal: FC<AddModalProps> = ({ isOpen, onClose, handleReload }) => {
    // Media States
    const [image, setImage] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDataType[]>([]);
    const [brands, setBrands] = useState<BrandDataType[]>([]);
    const [stores, setStores] = useState<StoreDataType[]>([]);
    const [sellTypes, setSellTypes] = useState<SellTypeDataType[]>([]);
    const [tagLines, setTagLines] = useState<TagLineDataType[]>([]);
    const [categories, setCategories] = useState<CategoryDataType[]>([]);
    const [mainCategories, setMainCategories] = useState<MainCategoryDataType[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryDataType[]>([]);
    const [leafCategories, setLeafCategories] = useState<LeafCategoryDataType[]>([]);
    const [isCategoryLoading, setIsCategoryLoading] = useState(false);

    // Crop Modal States
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (isOpen) {
            const fetchData = async () => {
                setIsCategoryLoading(true);
                try {
                    const [catRes, pmRes, stRes, tlRes, brRes, strRes] = await Promise.all([
                        getCategories(),
                        getPaymentMethods(),
                        getSellTypes(),
                        getTagLines(),
                        getBrands(),
                        getStores(),
                    ]);

                    if (catRes?.success) setCategories(catRes.categories || []);
                    if (pmRes?.success) setPaymentMethods(pmRes.paymentMethods || []);
                    if (stRes?.success) setSellTypes(stRes.sellTypes || []);
                    if (tlRes?.success) setTagLines(tlRes.tagLines || []);
                    if (brRes?.success) setBrands(brRes.brands || []);
                    if (strRes?.success) setStores(strRes.stores || []);
                } catch (error) {
                    toast.error("Failed to fetch initial form selection data.");
                    console.error(error);
                } finally {
                    setIsCategoryLoading(false);
                }
            };

            fetchData();
        }
    }, [isOpen]);

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
        values: AddProductFormValues,
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
                setFieldError("image", "Main image is required");
                toast.error("Please upload the required main product image.");
                setSubmitting(false);
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("slug", values.slug);
            formData.append("mainImage", image);

            // Foreign Keys & Categorization
            formData.append("brandId", String(values.brandId));
            formData.append("storeId", String(values.storeId));
            formData.append("categoryId", String(values.categoryId));
            formData.append("mainCategoryId", String(values.mainCategoryId));
            formData.append("subCategoryId", String(values.subCategoryId));
            formData.append("leafCategoryId", String(values.leafCategoryId));
            formData.append("sellType", String(values.sellType));
            formData.append("tagLineId", String(values.tagLineId));

            formData.append("paymentMethods", JSON.stringify(values.paymentMethods));
            formData.append("keyFeatures", JSON.stringify(values.keyFeatures || []));
            formData.append("tags", JSON.stringify(values.tags || []));

            const response = await createProduct(formData);

            if (response?.success) {
                toast.success(response.message || "Product created successfully!");
                resetForm();
                setImage(null);
                setMainCategories([]);
                setSubCategories([]);
                setLeafCategories([]);
                setTimeout(() => {
                    onClose();
                    handleReload();
                }, 300);
            } else {
                toast.error(response?.message || "Failed to add product.");
            }
        } catch (error) {
            toast.error("An error occurred while adding the product.");
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
                    <h2 className="font-semibold text-lg">Add New Product</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={onClose} />
                </div>

                <Formik
                    initialValues={addFullProductInitialValues}
                    validationSchema={addFullProductValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }: FormikProps<AddProductFormValues>) => (
                        <Form className="flex flex-col overflow-hidden">
                            <div className="flex flex-col gap-4 max-h-[65vh] overflow-y-auto p-4">
                                {/* Title & Slug */}
                                <div className="grid grid-cols-1 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Title *
                                        <Field
                                            name="title"
                                            type="text"
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const title = e.target.value;
                                                setFieldValue("title", title);
                                                setFieldValue("slug", slugify(title));
                                            }}
                                        />
                                        <ErrorMessage
                                            name="title"
                                            component="div"
                                            className="text-red-600 text-xs"
                                        />
                                    </label>

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
                                </div>

                                {/* Brand & Store */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Brand
                                        <select
                                            name="brandId"
                                            value={values.brandId}
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black"
                                            onChange={(e) => setFieldValue("brandId", Number(e.target.value))}
                                        >
                                            <option value={0}>Select Brand</option>
                                            {brands.map((st) => (
                                                <option key={st.id} value={st.id}>
                                                    {st.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Store
                                        <select
                                            name="storeId"
                                            value={values.storeId}
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black"
                                            onChange={(e) => setFieldValue("storeId", Number(e.target.value))}
                                        >
                                            <option value={0}>Select Store</option>
                                            {stores.map((tl) => (
                                                <option key={tl.id} value={tl.id}>
                                                    {tl.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                {/* Category Hierarchy Cascade */}
                                <div className="p-3 bg-gray-50 border border-gray-200 rounded-md flex flex-col gap-3 relative">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Category Hierarchy
                                        </h4>
                                        {isCategoryLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {/* Top Category */}
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
                                                        if (res?.success) setMainCategories(res.mainCategories);
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

                                        {/* Main Category */}
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
                                                        if (res?.success) setSubCategories(res.subCategories);
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

                                        {/* Sub Category */}
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
                                                        if (res?.success) setLeafCategories(res.leafCategories);
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

                                        {/* Leaf Category */}
                                        <label className="text-sm font-medium flex flex-col gap-1">
                                            Leaf Category
                                            <select
                                                name="leafCategoryId"
                                                value={values.leafCategoryId || 0}
                                                disabled={!values.subCategoryId || values.subCategoryId === 0}
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                                                onChange={(e) =>
                                                    setFieldValue("leafCategoryId", Number(e.target.value))
                                                }
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
                                </div>

                                {/* Classification & Metadata */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Sell Type
                                        <select
                                            name="sellType"
                                            value={values.sellType}
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black"
                                            onChange={(e) => setFieldValue("sellType", Number(e.target.value))}
                                        >
                                            <option value={0}>Select Sell Type</option>
                                            {sellTypes.map((st) => (
                                                <option key={st.id} value={st.id}>
                                                    {st.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>

                                    <label className="text-sm font-medium flex flex-col gap-1">
                                        Tag Line
                                        <select
                                            name="tagLineId"
                                            value={values.tagLineId}
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full bg-white outline-none focus:border-black"
                                            onChange={(e) => setFieldValue("tagLineId", Number(e.target.value))}
                                        >
                                            <option value={0}>Select Tag Line</option>
                                            {tagLines.map((tl) => (
                                                <option key={tl.id} value={tl.id}>
                                                    {tl.name}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>

                                {/* Key Features List */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Key Features</span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFieldValue("keyFeatures", [...(values.keyFeatures || []), ""])
                                            }
                                            className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                                        >
                                            <Plus className="w-3 h-3" /> Add Feature
                                        </button>
                                    </div>
                                    {values.keyFeatures?.map((feature, index) => (
                                        <div key={index} className="flex gap-2 items-center">
                                            <Field
                                                name={`keyFeatures.${index}`}
                                                type="text"
                                                placeholder={`Feature #${index + 1}`}
                                                className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updated = [...(values.keyFeatures || [])];
                                                    updated.splice(index, 1);
                                                    setFieldValue("keyFeatures", updated);
                                                }}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">Tags</span>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            placeholder="Type a tag and press enter"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    if (tagInput.trim()) {
                                                        setFieldValue("tags", [...(values.tags || []), tagInput.trim()]);
                                                        setTagInput("");
                                                    }
                                                }
                                            }}
                                            className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {values.tags?.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="bg-gray-100 text-xs px-2 py-1 rounded flex items-center gap-1"
                                            >
                                                {tag}
                                                <X
                                                    className="w-3 h-3 cursor-pointer hover:text-red-500"
                                                    onClick={() => {
                                                        const updated = values.tags?.filter((_, i) => i !== idx);
                                                        setFieldValue("tags", updated);
                                                    }}
                                                />
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Methods Checkboxes */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-sm font-medium">Payment Methods</span>
                                    <div className="flex flex-wrap gap-4 border border-gray-200 p-3 rounded-md">
                                        {paymentMethods.map((pm) => (
                                            <label key={pm.id} className="inline-flex items-center text-xs gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    value={pm.id}
                                                    checked={values.paymentMethods.includes(pm.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFieldValue("paymentMethods", [...values.paymentMethods, pm.id]);
                                                        } else {
                                                            setFieldValue(
                                                                "paymentMethods",
                                                                values.paymentMethods.filter((id) => id !== pm.id)
                                                            );
                                                        }
                                                    }}
                                                    className="rounded border-gray-300"
                                                />
                                                {pm.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Main Image Upload */}
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Main Image (≤ 1.1 MB) *
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="block w-full text-xs text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border file:text-xs file:font-semibold file:bg-gray-50 hover:file:bg-gray-100 file:border-gray-200 cursor-pointer"
                                    />
                                    <ErrorMessage
                                        name="image"
                                        component="div"
                                        className="text-red-600 text-xs"
                                    />
                                    {image && (
                                        <div className="mt-2 relative w-28 h-28 border rounded overflow-hidden">
                                            <Image
                                                src={URL.createObjectURL(image)}
                                                alt="Image Preview"
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
                                    cropHeight={1000}
                                />
                            )}

                            {/* Form Action Buttons */}
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
                                    className="px-4 py-2 text-sm bg-black hover:bg-gray-800 text-white rounded-lg w-full cursor-pointer transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isLoading ? "Adding..." : "Add Product"}
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

export default AddProductModal;
