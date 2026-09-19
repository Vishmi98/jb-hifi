import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, ImageIcon, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { AddSpecificationModalProps } from "../../products.types";
import { addProductImages } from "../../products.service";

import { MAX_SIZE_MB } from "@/constants/data";
import ImageCropper from "@/components/ImageCropper";


const MAX_IMAGES = 10;

export const AddImagesModal: React.FC<AddSpecificationModalProps> = ({
    isOpen,
    onClose,
    product,
    reloadData,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // Crop Modal States & Queue
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [tempImageFile, setTempImageFile] = useState<File | null>(null);
    const [pendingCropQueue, setPendingCropQueue] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    if (!isOpen || !product) return null;

    const existingCount = product.images?.length || 0;
    const remainingSlots = MAX_IMAGES - existingCount;

    // Process incoming files and trigger crop flow sequentially
    const handleFileChange = (files: FileList | File[]) => {
        const incomingArray = Array.from(files);

        if (selectedFiles.length + incomingArray.length > remainingSlots) {
            toast.error(
                `You can only upload up to ${remainingSlots} more image(s). Limit is ${MAX_IMAGES} total.`
            );
            return;
        }

        const validIncomingFiles: File[] = [];

        for (const file of incomingArray) {
            if (!file.type.startsWith("image/")) {
                toast.error(`${file.name} is not a valid image file.`);
                continue;
            }

            if (file.size > MAX_SIZE_MB) {
                toast.error(`${file.name} exceeds the 1.1 MB size limit.`);
                continue;
            }

            validIncomingFiles.push(file);
        }

        if (validIncomingFiles.length === 0) return;

        // Reset file input value so the same file can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }

        // Set the first file for cropping and queue remaining files
        const [firstFile, ...restQueue] = validIncomingFiles;
        setTempImageFile(firstFile);
        setPendingCropQueue(restQueue);
        setIsCropOpen(true);
    };

    // Callback triggered when cropping finishes for a single file
    const handleCropComplete = (croppedFile: File) => {
        if (croppedFile.size > MAX_SIZE_MB) {
            toast.error("Cropped image exceeds the 1.1 MB limit.");
        } else {
            setSelectedFiles((prev) => [...prev, croppedFile]);
            setPreviews((prev) => [...prev, URL.createObjectURL(croppedFile)]);
        }

        // Process next image in queue if available
        if (pendingCropQueue.length > 0) {
            const [nextFile, ...remainingQueue] = pendingCropQueue;
            setTempImageFile(nextFile);
            setPendingCropQueue(remainingQueue);
        } else {
            setTempImageFile(null);
            setIsCropOpen(false);
        }
    };

    const handleRemoveSelected = (index: number) => {
        URL.revokeObjectURL(previews[index]);
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileChange(e.dataTransfer.files);
        }
    };

    const handleResetAndClose = () => {
        previews.forEach((url) => URL.revokeObjectURL(url));
        setSelectedFiles([]);
        setPreviews([]);
        setIsCropOpen(false);
        setTempImageFile(null);
        setPendingCropQueue([]);
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image to upload.");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("productId", product.id.toString());
            selectedFiles.forEach((file) => {
                formData.append("images", file);
            });

            const response = await addProductImages(formData);

            if (response.success) {
                toast.success("Images uploaded successfully!");
                reloadData();
                handleResetAndClose();
            } else {
                toast.error(response.message || "Failed to upload images.");
            }
        } catch (error) {
            console.error("Error uploading images:", error);
            toast.error("An unexpected error occurred while uploading.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div onClick={handleResetAndClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="font-semibold text-lg">Add Product Gallery Images</h2>
                    <X className="w-5 h-5 cursor-pointer text-gray-500 hover:text-black" onClick={handleResetAndClose} />
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto p-4">
                        {/* Active Limit Tracker */}
                        <div className="flex items-center justify-between rounded-lg bg-blue-50/60 p-3 border border-blue-100">
                            <span className="text-xs font-medium text-blue-900">
                                Total Allowed: <strong className="font-semibold">{MAX_IMAGES}</strong>
                            </span>
                            <span className="text-xs font-medium text-blue-700">
                                Current: <strong>{existingCount}</strong> | Remaining: <strong>{remainingSlots}</strong>
                            </span>
                        </div>

                        {/* Existing Images Preview */}
                        {product.images && product.images.length > 0 && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Current Images ({product.images.length})
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {product.images.map((url, i) => (
                                        <div key={i} className="relative h-34 w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                            <Image
                                                src={url}
                                                alt={`Product image ${i + 1}`}
                                                fill
                                                className="object-cover"
                                                sizes="150px"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload & Dropzone */}
                        {remainingSlots > 0 ? (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Add New Product Images
                                </label>
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => {
                                        if (selectedFiles.length < remainingSlots && !isSubmitting) {
                                            fileInputRef.current?.click();
                                        }
                                    }}
                                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 transition-colors ${selectedFiles.length >= remainingSlots
                                        ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                                        : isDragging
                                            ? "border-black bg-gray-50 cursor-pointer"
                                            : "border-gray-300 hover:border-black bg-gray-50/50 hover:bg-gray-50 cursor-pointer"
                                        }`}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => e.target.files && handleFileChange(e.target.files)}
                                        disabled={selectedFiles.length >= remainingSlots || isSubmitting}
                                    />

                                    <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-700">
                                        Click or drag file to upload
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        PNG, JPG, WEBP (≤ 1.1 MB) | Remaining slots: {remainingSlots - selectedFiles.length}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 text-center rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium">
                                Image capacity full ({MAX_IMAGES}/{MAX_IMAGES}). Remove existing images to upload new ones.
                            </div>
                        )}

                        {/* Selected & Cropped Image Previews */}
                        {previews.length > 0 && (
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                                    Ready to Upload ({previews.length})
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {previews.map((src, idx) => (
                                        <div key={idx} className="relative group h-34 w-full rounded-md overflow-hidden border border-black/10 bg-gray-100">
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
                                                className="absolute top-1 right-1 bg-black/70 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                                                disabled={isSubmitting}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
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
                            className="flex justify-center items-center w-full gap-2 px-5 py-2 font-semibold text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <ImageIcon className="w-3.5 h-3.5" />
                                    Upload Images {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Crop Modal Component */}
                {isCropOpen && tempImageFile && (
                    <ImageCropper
                        imageFile={tempImageFile}
                        onCropComplete={handleCropComplete}
                        onClose={() => {
                            setIsCropOpen(false);
                            setTempImageFile(null);
                            setPendingCropQueue([]);
                        }}
                        cropWidth={800}
                        cropHeight={800} // Standard 1:1 square ratio for product gallery images
                    />
                )}
            </div>
        </div>
    );
};