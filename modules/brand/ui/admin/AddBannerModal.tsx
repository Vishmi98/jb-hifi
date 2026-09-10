/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { X, UploadCloud, Trash2, Loader2, ImagePlus } from "lucide-react";

import { AddBannerModalProps } from "../../brand.types";
import { addBrandBanners } from "../../brand.service";

import ImageCropper from "@/components/ImageCropper";
import { MAX_SIZE_MB } from "@/constants/data";


const MAX_TOTAL_BANNERS = 5;

export const AddBannerModal: React.FC<AddBannerModalProps> = ({
    isOpen,
    onClose,
    brand,
    reloadData,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Crop Modal States
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen || !brand) return null;

    const existingCount = brand.bannerImages?.length || 0;
    const remainingSlots = MAX_TOTAL_BANNERS - existingCount;

    // File Selection Handler - Validates Size and Prepares for Cropping
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input value so the same file can be selected again if needed
        e.target.value = "";

        if (selectedFiles.length >= remainingSlots) {
            setError(`You can only upload up to ${remainingSlots} more banner(s). Limit is ${MAX_TOTAL_BANNERS} total.`);
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Only image files are supported.");
            return;
        }

        // Validate File Size (1.1 MB limit)
        if (file.size > MAX_SIZE_MB) {
            setError("Please upload an image smaller than 1.1 MB.");
            return;
        }

        // Open Crop Modal for selected image
        setTempImageFile(file);
        setIsCropOpen(true);
    };

    // Callback when crop operation finishes
    const handleCropComplete = (croppedFile: File) => {
        // Re-validate cropped file size if necessary
        if (croppedFile.size > MAX_SIZE_MB) {
            setError("Cropped image exceeds 1.1 MB limit.");
            setTempImageFile(null);
            setIsCropOpen(false);
            return;
        }

        setSelectedFiles((prev) => [...prev, croppedFile]);
        setPreviews((prev) => [...prev, URL.createObjectURL(croppedFile)]);
        setTempImageFile(null);
        setIsCropOpen(false);
    };

    const handleRemoveSelected = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
        setError(null);
    };

    const handleResetAndClose = () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviews([]);
        setError(null);
        setIsCropOpen(false);
        setTempImageFile(null);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedFiles.length === 0) {
            setError("Please select at least one banner image.");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("brandId", String(brand.id));
            selectedFiles.forEach((file) => {
                formData.append("bannerImages", file);
            });

            const res = await addBrandBanners(formData);

            if (res.success) {
                reloadData();
                handleResetAndClose();
            } else {
                setError(res.message || "Failed to upload banners.");
            }
        } catch (err: any) {
            setError(err?.response?.data?.message || err?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div onClick={handleResetAndClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add Banners</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={handleResetAndClose} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                        {/* Active Limit Tracker */}
                        <div className="flex items-center justify-between rounded-lg bg-blue-50/60 p-3 border border-blue-100">
                            <span className="text-xs font-medium text-blue-900">
                                Total Allowed: <strong className="font-semibold">{MAX_TOTAL_BANNERS}</strong>
                            </span>
                            <span className="text-xs font-medium text-blue-700">
                                Current: <strong>{existingCount}</strong> | Remaining: <strong>{remainingSlots}</strong>
                            </span>
                        </div>

                        {/* Existing Banners Preview */}
                        {brand.bannerImages && brand.bannerImages.length > 0 && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Current Banners ({brand.bannerImages.length})
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {brand.bannerImages.map((url, i) => (
                                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                                            <Image
                                                src={url}
                                                alt={`Banner ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="200px"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload Dropzone */}
                        {remainingSlots > 0 ? (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Add New Banner Image
                                </label>
                                <div
                                    onClick={() => {
                                        if (selectedFiles.length < remainingSlots && !isSubmitting) {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors ${selectedFiles.length >= remainingSlots
                                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                        : "border-gray-300 hover:border-black bg-gray-50/50 hover:bg-gray-50 cursor-pointer"
                                        }`}
                                >
                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">
                                        Click or drag file to upload
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, WEBP (≤ 1.1 MB) | Remaining: {remainingSlots - selectedFiles.length}
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={selectedFiles.length >= remainingSlots || isSubmitting}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 text-center rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                                Banner capacity full ({MAX_TOTAL_BANNERS}/{MAX_TOTAL_BANNERS}). Remove existing banners to upload new ones.
                            </div>
                        )}

                        {/* Selected & Cropped Image Previews */}
                        {previews.length > 0 && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Ready to Upload ({previews.length})
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-black/10 bg-gray-100 group">
                                            <Image
                                                src={src}
                                                alt={`Preview ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="150px"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSelected(idx)}
                                                className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors"
                                                disabled={isSubmitting}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
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
                            disabled={isSubmitting || selectedFiles.length === 0}
                            className="flex justify-center items-center w-full gap-2 px-5 py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <ImagePlus className="w-3.5 h-3.5" />
                                    Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Integrated Crop Modal Window */}
                {isCropOpen && tempImageFile && (
                    <ImageCropper
                        imageFile={tempImageFile}
                        onCropComplete={handleCropComplete}
                        onClose={() => {
                            setIsCropOpen(false);
                            setTempImageFile(null);
                        }}
                        cropWidth={2550}
                        cropHeight={850} // Typical aspect ratio for banner images (16:9 approx)
                    />
                )}
            </div>
        </div>
    );
};