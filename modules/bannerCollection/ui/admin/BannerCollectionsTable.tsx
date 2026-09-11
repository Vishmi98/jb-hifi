"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

import { BannerCollectionDataType } from "../../bannerCollection.types";
import { deleteBannerCollection, getBannerCollections, publishBannerCollection } from "../../bannerCollection.service";
import AddBannerItemModal from "./AddBannerItemModal";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";
import { ConfirmModal } from "@/components/ConfirmModal";


const BannerCollectionsTable: React.FC<TableProps> = ({ reload }) => {
    const [bannerCollections, setBannerCollections] = useState<BannerCollectionDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedDeleteBannerCollection, setSelectedDeleteBannerCollection] = useState<BannerCollectionDataType | null>(null);
    const [selectedAddItemBannerCollection, setSelectedAddItemBannerCollection] = useState<BannerCollectionDataType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
    const [publishTarget, setPublishTarget] = useState<BannerCollectionDataType | null>(null);
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

    const fetchData = useCallback(async (paramPage?: number) => {
        setIsLoading(true);
        try {
            const currentPage = paramPage ?? 1;
            const response = await getBannerCollections(currentPage, limit);

            if (response.success) {
                setBannerCollections(response.bannerCollections);
                setTotalRows(response.totalBannerCollections);
                setTotalPages(response.totalPages);
                setPage(currentPage);
            } else {
                setBannerCollections([]);
            }
        } catch {
            setBannerCollections([]);
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        const loadCollections = async () => {
            await fetchData(1);
        };

        void loadCollections();
    }, [reload, fetchData]);

    const handleDeleteBannerCollection = (bannerCollection: BannerCollectionDataType) => {
        setSelectedDeleteBannerCollection(bannerCollection);
        setIsDeleteModalOpen(true);
    };

    const handleAddBannerItem = (bannerCollection: BannerCollectionDataType) => {
        setSelectedAddItemBannerCollection(bannerCollection);
        setIsAddItemModalOpen(true);
    };

    const handlePublishToggle = (bannerCollection: BannerCollectionDataType) => {
        setPublishTarget(bannerCollection);
        setIsPublishModalOpen(true);
    };

    const confirmDeleteBannerCollection = async () => {
        if (!selectedDeleteBannerCollection) return;

        try {
            const response = await deleteBannerCollection(selectedDeleteBannerCollection.id);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to delete banner collection:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedDeleteBannerCollection(null);
        }
    };

    const confirmPublishToggle = async () => {
        if (!publishTarget) return;

        try {
            const response = await publishBannerCollection(publishTarget.id, !publishTarget.isActive);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to update category publish state:", error);
        } finally {
            setIsPublishModalOpen(false);
            setPublishTarget(null);
        }
    };

    const columns: ColumnType<BannerCollectionDataType>[] = [
        {
            header: "Banner Type",
            accessor: "bannerType",
        },
        {
            header: "Items",
            accessor: "items",
            render: (category) => category.items?.length || 0,
        },
        {
            header: "Publish",
            accessor: "isActive",
            render: (category) => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={category.isActive}
                        className="sr-only peer"
                        onChange={() => handlePublishToggle(category)}
                    />
                    <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-4 after:h-4 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                </label>
            ),
        },
        {
            header: "Actions",
            accessor: "id",
            render: (category) => (
                <div className="flex items-center space-x-5">
                    <button
                        onClick={() => handleAddBannerItem(category)}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                        title="Edit Category"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteBannerCollection(category)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-red-500"
                        title={
                            category.isActive
                                ? "Published categories cannot be deleted"
                                : "Delete Category"
                        }
                        disabled={category.isActive}
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <>
            <CommonTable
                columns={columns}
                data={bannerCollections}
                isLoading={isLoading}
                expandable
                page={page}
                limit={limit}
                totalRows={totalRows}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                    void fetchData(newPage);
                }}
                renderExpandedRow={(bannerCollection) => (
                    <div className="space-y-4 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm">Collection Items</h3>
                            <span className="text-xs text-gray-500">{bannerCollection.items.length} item(s)</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {bannerCollection.items.length > 0 ? (
                                bannerCollection.items.map((item) => (
                                    <div key={item.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                        {item.imagePath && (
                                            <div className="relative mb-3 h-32 w-full overflow-hidden rounded-md">
                                                <Image
                                                    src={item.imagePath}
                                                    alt={`Banner item ${item.id}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2 text-xs text-gray-600">
                                            {item.categoryInfo && <p><span className="font-semibold text-gray-800">Category:</span> {item.categoryInfo.name}</p>}
                                            {item.mainCategoryInfo && <p><span className="font-semibold text-gray-800">Main Category:</span> {item.mainCategoryInfo.name}</p>}
                                            {item.subCategoryInfo && <p><span className="font-semibold text-gray-800">Sub Category:</span> {item.subCategoryInfo.name}</p>}
                                            {item.leafCategoryInfo && <p><span className="font-semibold text-gray-800">Leaf Category:</span> {item.leafCategoryInfo.name}</p>}
                                            {item.brandInfo && <p><span className="font-semibold text-gray-800">Brand:</span> {item.brandInfo.name}</p>}
                                            {item.productInfo && <p><span className="font-semibold text-gray-800">Product:</span> {item.productInfo.name}</p>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full rounded-md border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                                    No items added yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            />

            {/* Publish Modal */}
            <ConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => {
                    setIsPublishModalOpen(false);
                    setPublishTarget(null);
                }}
                onConfirm={confirmPublishToggle}
                message={`Are you sure you want to ${publishTarget?.isActive ? "unpublish" : "publish"
                    } this category?`}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedDeleteBannerCollection(null);
                }}
                onConfirm={confirmDeleteBannerCollection}
                message={`Are you sure you want to delete ${selectedDeleteBannerCollection?.bannerType || "this banner collection"}?`}
            />

            {selectedAddItemBannerCollection && (
                <AddBannerItemModal
                    isOpen={isAddItemModalOpen}
                    onClose={() => {
                        setIsAddItemModalOpen(false);
                        setSelectedAddItemBannerCollection(null);
                    }}
                    bannerCollection={selectedAddItemBannerCollection}
                    reloadData={() => fetchData(page)}
                />
            )}
        </>
    );
};

export default BannerCollectionsTable;
