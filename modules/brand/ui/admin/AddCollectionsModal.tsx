/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, UploadCloud, Trash2, Loader2, Layers } from "lucide-react";

import { AddBannerModalProps } from "../../brand.types";
import { addBrandCollections } from "../../brand.service";

import ImageCropper from "@/components/ImageCropper"; // Adjust path as needed
import { CategoryDataType } from "@/modules/category/category.types";
import { MainCategoryDataType } from "@/modules/mainCategory/mainCategory.types";
import { SubCategoryDataType } from "@/modules/subCategory/subCategory.types";
import { getCategories } from "@/modules/category/category.service";
import { getMainCategoryByCategory } from "@/modules/mainCategory/mainCategory.service";
import { getSubCategoryByMainCategory } from "@/modules/subCategory/subCategory.service";
import { MAX_SIZE_MB } from "@/constants/data";


export const AddCollectionModal: React.FC<AddBannerModalProps> = ({
    isOpen,
    onClose,
    brand,
    reloadData,
}) => {
    // Dynamic Data Options
    const [categories, setCategories] = useState<CategoryDataType[]>([]);
    const [mainCategories, setMainCategories] = useState<MainCategoryDataType[]>([]);
    const [subCategories, setSubCategories] = useState<SubCategoryDataType[]>([]);

    // Loading States for Dropdowns
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingMainCategories, setLoadingMainCategories] = useState(false);
    const [loadingSubCategories, setLoadingSubCategories] = useState(false);

    // Form Inputs
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>("");
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>("");
    const [compareLink, setCompareLink] = useState<string>("");

    // File & Preview States
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Crop Modal States
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial Fetch: Categories
    useEffect(() => {
        if (!isOpen) return;

        const fetchCategoriesList = async () => {
            setLoadingCategories(true);
            try {
                const res = await getCategories(1, 100);
                if (res.success && res.categories) {
                    setCategories(res.categories);
                }
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            } finally {
                setLoadingCategories(false);
            }
        };

        fetchCategoriesList();
    }, [isOpen]);

    // Handle Category Selection → Fetch Main Categories
    const handleCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catId = e.target.value;
        setSelectedCategoryId(catId);
        setSelectedMainCategoryId("");
        setSelectedSubCategoryId("");
        setMainCategories([]);
        setSubCategories([]);

        if (!catId) return;

        setLoadingMainCategories(true);
        try {
            const res = await getMainCategoryByCategory({ categoryId: Number(catId) });
            if (res.success && res.mainCategories) {
                setMainCategories(res.mainCategories);
            }
        } catch (err) {
            console.error("Failed to fetch main categories:", err);
        } finally {
            setLoadingMainCategories(false);
        }
    };

    // Handle Main Category Selection → Fetch Sub Categories
    const handleMainCategoryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mainCatId = e.target.value;
        setSelectedMainCategoryId(mainCatId);
        setSelectedSubCategoryId("");
        setSubCategories([]);

        if (!mainCatId) return;

        setLoadingSubCategories(true);
        try {
            const res = await getSubCategoryByMainCategory({ mainCategoryId: Number(mainCatId) });
            if (res.success && res.subCategories) {
                setSubCategories(res.subCategories);
            }
        } catch (err) {
            console.error("Failed to fetch sub categories:", err);
        } finally {
            setLoadingSubCategories(false);
        }
    };

    if (!isOpen || !brand) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        e.target.value = "";

        if (!file.type.startsWith("image/")) {
            setError("Only image files are supported.");
            return;
        }

        if (file.size > MAX_SIZE_MB) {
            setError("Please upload an image smaller than 1.1 MB.");
            return;
        }

        setTempImageFile(file);
        setIsCropOpen(true);
    };

    const handleCropComplete = (croppedFile: File) => {
        if (croppedFile.size > MAX_SIZE_MB) {
            setError("Cropped image exceeds 1.1 MB limit.");
            setTempImageFile(null);
            setIsCropOpen(false);
            return;
        }

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setSelectedFile(croppedFile);
        setPreview(URL.createObjectURL(croppedFile));
        setTempImageFile(null);
        setIsCropOpen(false);
    };

    const handleRemoveImage = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setSelectedFile(null);
        setPreview(null);
        setError(null);
    };

    const handleResetAndClose = () => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setSelectedFile(null);
        setPreview(null);
        setSelectedCategoryId("");
        setSelectedMainCategoryId("");
        setSelectedSubCategoryId("");
        setMainCategories([]);
        setSubCategories([]);
        setCompareLink("");
        setError(null);
        setIsCropOpen(false);
        setTempImageFile(null);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMainCategoryId) {
            setError("Main Category selection is required.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("brandId", String(brand.id));

            // Preserve existing collections + add new entry at the end
            const existingCollections = brand.collections || [];
            const newCollectionIndex = existingCollections.length;

            const newCollectionItem = {
                categoryId: selectedCategoryId ? Number(selectedCategoryId) : undefined,
                mainCategoryId: selectedMainCategoryId ? Number(selectedMainCategoryId) : undefined,
                subCategoryId: selectedSubCategoryId ? Number(selectedSubCategoryId) : undefined,
                compareLink: compareLink || "",
            };

            const updatedCollections = [...existingCollections, newCollectionItem];

            // Append collections array as JSON string
            formData.append("collections", JSON.stringify(updatedCollections));

            // Attach image with the specific indexed key expected by the API
            if (selectedFile) {
                formData.append(`collectionImage_${newCollectionIndex}`, selectedFile);
            }

            const res = await addBrandCollections(formData);

            if (res.success) {
                reloadData();
                handleResetAndClose();
            } else {
                setError(res.message || "Failed to add collection.");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div onClick={handleResetAndClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3 cursor-default">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add Collection to {brand.name}</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={handleResetAndClose} />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">

                        {/* Cascading Category Selectors */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Category Dropdown */}
                            <div>
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Category
                                </label>
                                <select
                                    value={selectedCategoryId}
                                    onChange={handleCategoryChange}
                                    disabled={loadingCategories || isSubmitting}
                                    className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Main Category Dropdown */}
                            <div>
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Main Category *
                                </label>
                                <select
                                    value={selectedMainCategoryId}
                                    onChange={handleMainCategoryChange}
                                    disabled={!selectedCategoryId || loadingMainCategories || isSubmitting}
                                    required
                                    className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                >
                                    <option value="">
                                        {loadingMainCategories
                                            ? "Loading..."
                                            : !selectedCategoryId
                                                ? "Select Category First"
                                                : "Select Main Category"}
                                    </option>
                                    {mainCategories.map((mc) => (
                                        <option key={mc.id} value={mc.id}>
                                            {mc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Sub Category Dropdown */}
                            <div>
                                <label className="text-sm font-medium flex flex-col gap-1">
                                    Sub Category
                                </label>
                                <select
                                    value={selectedSubCategoryId}
                                    onChange={(e) => setSelectedSubCategoryId(e.target.value)}
                                    disabled={!selectedMainCategoryId || loadingSubCategories || isSubmitting}
                                    className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                                >
                                    <option value="">
                                        {loadingSubCategories
                                            ? "Loading..."
                                            : !selectedMainCategoryId
                                                ? "Select Main Category First"
                                                : "Select Sub Category"}
                                    </option>
                                    {subCategories.map((sc) => (
                                        <option key={sc.id} value={sc.id}>
                                            {sc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Compare Link Input */}
                        <div>
                            <label className="text-sm font-medium flex flex-col gap-1">
                                Compare Link
                            </label>
                            <input
                                type="string"
                                value={compareLink}
                                onChange={(e) => setCompareLink(e.target.value)}
                                className="border border-gray-300 rounded-sm text-sm p-2 w-full outline-none focus:border-black"
                            />
                        </div>

                        {/* Upload Image Dropzone or Preview */}
                        <div>
                            <label className="text-sm font-medium flex flex-col gap-1">
                                Collection Cover Image (Optional)
                            </label>

                            {!preview ? (
                                <div
                                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-5 border-gray-300 hover:border-black bg-gray-50/50 hover:bg-gray-50 cursor-pointer transition-colors"
                                >
                                    <UploadCloud className="w-7 h-7 text-gray-400 mb-1" />
                                    <p className="text-xs font-medium text-gray-700">
                                        Click or drag file to upload
                                    </p>
                                    <p className="text-[11px] text-gray-400 mt-1">
                                        PNG, JPG, WEBP (≤ 1.1 MB)
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            ) : (
                                <div className="relative aspect-video rounded-lg overflow-hidden border border-black/10 bg-gray-100 group w-full h-[150px] max-w-xs mx-auto">
                                    <Image
                                        src={preview}
                                        alt="Collection preview"
                                        fill
                                        className="object-cover"
                                        sizes="300px"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Existing Collections Count */}
                        {brand.collections && brand.collections.length > 0 && (
                            <div className="p-3 rounded-lg bg-gray-50 border text-xs text-gray-600 flex justify-between items-center">
                                <span>Existing collections for this brand:</span>
                                <strong className="font-semibold text-black">{brand.collections.length}</strong>
                            </div>
                        )}

                        {/* Error Display */}
                        {error && (
                            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end space-x-2 p-4 border-t bg-gray-50">
                        <button
                            type="button"
                            onClick={handleResetAndClose}
                            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg w-full cursor-pointer transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex justify-center items-center w-full gap-2 px-5 py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Layers className="w-3.5 h-3.5" />
                                    Add Collection
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Integrated Crop Modal */}
                {isCropOpen && tempImageFile && (
                    <ImageCropper
                        imageFile={tempImageFile}
                        onCropComplete={handleCropComplete}
                        onClose={() => {
                            setIsCropOpen(false);
                            setTempImageFile(null);
                        }}
                        cropWidth={2550}
                        cropHeight={900}
                    />
                )}
            </div>
        </div>
    );
};