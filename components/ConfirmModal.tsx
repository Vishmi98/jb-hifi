"use client"

import { useState } from "react";
import { X } from "lucide-react";

import Loader from "@/components/Loader";
import { ConfirmModalProps } from "@/constants/types";


export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, message }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setIsLoading(true);
            await onConfirm();
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div onClick={onClose} className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center cursor-pointer">
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg w-full max-w-md h-auto overflow-hidden flex flex-col mx-3">
                <div className="flex justify-between items-center p-4">
                    <h2 className="font-semibold">Confirmation</h2>
                    <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
                </div>
                <div className="px-4 pb-4 space-y-5">
                    <p className="text-sm">{message}</p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs bg-gray-300 rounded-lg w-full cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isLoading}
                            className="px-4 py-2 text-xs rounded-lg w-full cursor-pointer bg-black text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader h={15} /> : "Confirm"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
