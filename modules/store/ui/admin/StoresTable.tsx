"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

import EditStoreModal from "./EditStoreModal";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";
import { ConfirmModal } from "@/components/ConfirmModal";
import { deleteStore, getStores, publishStore } from "@/modules/store/store.service";
import { StoreDataType } from "@/modules/store/store.types";


const StoresTable: React.FC<TableProps> = ({ reload }) => {
    const [stores, setStores] = useState<StoreDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [publishTarget, setPublishTarget] = useState<StoreDataType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<StoreDataType | null>(null);
    const [editTarget, setEditTarget] = useState<StoreDataType | null>(null);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = useCallback(
        async (paramPage?: number) => {
            setIsLoading(true);
            try {
                const currentPage = paramPage ?? page;
                const response = await getStores(currentPage, limit);

                if (response.success) {
                    setStores(response.stores);
                    setTotalRows(response.totalStores);
                    setTotalPages(response.totalPages);
                    setPage(currentPage);
                } else {
                    setStores([]);
                }
            } catch {
                setStores([]);
            } finally {
                setIsLoading(false);
            }
        },
        [limit, page]
    );

    useEffect(() => {
        fetchData(page);
    }, [reload, page]);

    const handlePublishToggle = (store: StoreDataType) => {
        setPublishTarget(store);
        setIsPublishModalOpen(true);
    };

    const confirmPublishToggle = async () => {
        if (!publishTarget) return;

        try {
            const response = await publishStore(publishTarget.id, !publishTarget.isActive);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to update store publish state:", error);
        } finally {
            setIsPublishModalOpen(false);
            setPublishTarget(null);
        }
    };

    const handleEditStore = (store: StoreDataType) => {
        setEditTarget(store);
        setIsEditModalOpen(true);
    };

    const handleDeleteStore = (store: StoreDataType) => {
        setDeleteTarget(store);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteStore = async () => {
        if (!deleteTarget) return;

        try {
            const response = await deleteStore(deleteTarget.id);

            if (response.success) {
                const isLastItemOnPage = stores.length === 1 && page > 1;
                const targetPage = isLastItemOnPage ? page - 1 : page;
                await fetchData(targetPage);
            }
        } catch (error) {
            console.error("Failed to delete store:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const columns: ColumnType<StoreDataType>[] = [
        {
            header: "Name",
            accessor: "name",
            render: (store) => (
                <div className="flex items-center space-x-3">
                    {store.logoPath ? (
                        <Image
                            src={store.logoPath}
                            alt={store.name}
                            width={40}
                            height={40}
                            className="w-20 h-20 object-cover border border-gray-200 shrink-0"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-500 text-sm shrink-0">
                            {store.name?.charAt(0).toUpperCase() || "S"}
                        </div>
                    )}
                    <span className="font-medium text-gray-900">{store.name}</span>
                </div>
            ),
        },
        {
            header: "Publish",
            accessor: "isActive",
            render: (store) => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={store.isActive}
                        className="sr-only peer"
                        onChange={() => handlePublishToggle(store)}
                    />
                    <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                </label>
            ),
        },
        {
            header: "Actions",
            accessor: "id",
            render: (store) => (
                <div className="flex items-center space-x-5">
                    <button
                        className="text-black hover:text-gray-700 transition-colors cursor-pointer"
                        onClick={() => handleEditStore(store)}
                        title="Edit Store"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-red-500"
                        onClick={() => handleDeleteStore(store)}
                        title={store.isActive ? "Published stores cannot be deleted" : "Delete Store"}
                        disabled={store.isActive}
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
                data={stores}
                isLoading={isLoading}
                expandable
                page={page}
                limit={limit}
                totalRows={totalRows}
                totalPages={totalPages}
                onPageChange={(newPage) => fetchData(newPage)}
                renderExpandedRow={(store) => (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50/50 rounded-lg text-sm">
                        {/* Column 1: Store Overview & Media */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 border-b pb-1">General Info</h4>
                            {store.logoPath ? (
                                <div>
                                    <span className="text-gray-500 block text-xs mb-1">Store Logo</span>
                                    <Image
                                        src={store.logoPath}
                                        alt={store.name}
                                        width={160}
                                        height={96}
                                        className="rounded-lg border object-cover bg-white"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <span className="text-gray-500 block text-xs">Store Logo</span>
                                    <p className="text-gray-400 italic text-xs">No logo uploaded</p>
                                </div>
                            )}
                            <div>
                                <span className="font-semibold text-gray-700">Slug:</span>
                                <p className="text-blue-600 font-mono text-xs">{store.slug}</p>
                            </div>
                        </div>

                        {/* Column 2: Business & Categorization */}
                        <div className="space-y-3">
                            <h4 className="font-semibold text-gray-900 border-b pb-1">Business Details</h4>
                            <div>
                                <span className="font-semibold text-gray-700">Description:</span>
                                <p className="text-gray-600 whitespace-pre-line">{store.description || "-"}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">ABN:</span>
                                <p className="text-gray-600">{store.abn || "-"}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Number of Employees:</span>
                                <p className="text-gray-600">{store.noOfEmployees ?? "-"}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Annual Revenue:</span>
                                <p className="text-gray-600">{store.annualRevenue || "-"}</p>
                            </div>
                            <div>
                                <span className="font-semibold text-gray-700">Categories (IDs):</span>
                                <p className="text-gray-600">
                                    {store.categories && store.categories.length > 0
                                        ? store.categories.join(", ")
                                        : "-"}
                                </p>
                            </div>
                        </div>

                        {/* Column 3: Shipping & FAQ Details */}
                        <div className="space-y-3 md:col-span-2 lg:col-span-1">
                            <h4 className="font-semibold text-gray-900 border-b pb-1">Shipping Details</h4>
                            <div>
                                <span className="font-semibold text-gray-700">Short Description:</span>
                                <p className="text-gray-600">
                                    {store.shipping?.shortDescription || "-"}
                                </p>
                            </div>

                            <div>
                                <span className="font-semibold text-gray-700 block mb-1">
                                    FAQs ({store.shipping?.faq?.length || 0}):
                                </span>
                                {store.shipping?.faq && store.shipping.faq.length > 0 ? (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                        {store.shipping.faq.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="p-2 border border-gray-200 rounded bg-white text-xs"
                                            >
                                                <p className="font-medium text-gray-800">
                                                    Q: {item.question || "-"}
                                                </p>
                                                <p className="text-gray-600 mt-1">
                                                    A: {item.answer || "-"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic text-xs">No FAQs provided</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            />

            <ConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => {
                    setIsPublishModalOpen(false);
                    setPublishTarget(null);
                }}
                onConfirm={confirmPublishToggle}
                message={`Are you sure you want to ${publishTarget?.isActive ? "unpublish" : "publish"} this store?`}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDeleteStore}
                message={`Are you sure you want to delete ${deleteTarget?.name || "this store"}?`}
            />

            <EditStoreModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setEditTarget(null);
                }}
                initialValues={editTarget}
                reloadData={() => fetchData(page)}
            />
        </>
    );
};

export default StoresTable;
