/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X } from "lucide-react";

import { getCroppedImg } from "@/utils/image.util";
import { CropModalProps } from "@/constants/types";


const ImageCropper: React.FC<CropModalProps> = ({
    imageFile,
    onCropComplete,
    onClose,
    cropWidth = 300,
    cropHeight = 300,
}) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropCompleteHandler = useCallback((_: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCrop = async () => {
        if (!imageFile || !croppedAreaPixels) return;
        const croppedFile = await getCroppedImg(imageFile, croppedAreaPixels, cropWidth, cropHeight);
        onCropComplete(croppedFile);
        onClose();
    };

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div onClick={(e) => e.stopPropagation()} className="relative bg-white rounded-lg w-full max-w-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="font-semibold">Crop Image</h2>
                    <X className="cursor-pointer" onClick={onClose} />
                </div>

                <div className="relative w-full h-80 bg-gray-200">
                    <Cropper
                        image={URL.createObjectURL(imageFile)}
                        crop={crop}
                        zoom={zoom}
                        aspect={cropWidth / cropHeight}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropCompleteHandler}
                    />
                </div>

                {/* Zoom Slider */}
                <div className="mt-4 px-2">
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full"
                    />
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        type="button"
                        className="px-4 py-2 text-sm bg-gray-300 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 text-sm bg-black text-white rounded"
                        onClick={handleCrop}
                    >
                        Crop & Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
