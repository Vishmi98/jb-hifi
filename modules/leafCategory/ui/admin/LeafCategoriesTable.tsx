"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

import { LeafCategoryDataType } from "../../leafCategory.types";
import { deleteLeafCategory, getLeafCategories, publishLeafCategory } from "../../leafCategory.service";
import EditLeafCategoryModal from "./EditLeafCategoryModal";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";
import { ConfirmModal } from "@/components/ConfirmModal";

const LeafCategoriesTable: React.FC<TableProps> = ({ reload }) => {
    const [categories, setCategories] = useState<LeafCategoryDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [publishTarget, setPublishTarget] = useState<LeafCategoryDataType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<LeafCategoryDataType | null>(null);
    const [selectedEditCategory, setSelectedEditCategory] = useState<LeafCategoryDataType | null>(null);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchData = useCallback(async (paramPage?: number) => {
        setIsLoading(true);
        try {
            const currentPage = paramPage ?? 1;
            const response = await getLeafCategories(currentPage, limit);

            if (response.success) {
                setCategories(response.leafCategories);
                setTotalRows(response.totalLeafCategories);
                setTotalPages(response.totalPages);
                setPage(currentPage);
            } else {
                setCategories([]);
            }
        } catch {
            setCategories([]);
        } finally {
            setIsLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        const loadCategories = async () => {
            await fetchData(1);
        };

        void loadCategories();
    }, [reload, fetchData]);

    const handlePublishToggle = (category: LeafCategoryDataType) => {
        setPublishTarget(category);
        setIsPublishModalOpen(true);
    };

    const confirmPublishToggle = async () => {
        if (!publishTarget) return;

        try {
            const response = await publishLeafCategory(publishTarget.id, !publishTarget.isActive);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to update leaf category publish state:", error);
        } finally {
            setIsPublishModalOpen(false);
            setPublishTarget(null);
        }
    };

    const handleEditCategory = (category: LeafCategoryDataType) => {
        setSelectedEditCategory(category);
        setIsEditModalOpen(true);
    };

    const handleDeleteCategory = (category: LeafCategoryDataType) => {
        setDeleteTarget(category);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteCategory = async () => {
        if (!deleteTarget) return;

        try {
            const response = await deleteLeafCategory(deleteTarget.id);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to delete leaf category:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const columns: ColumnType<LeafCategoryDataType>[] = [
        {
            header: "Name",
            accessor: "name",
        },
        {
            header: "Category",
            accessor: "categoryInfo",
            render: (category) => category.categoryInfo?.name || "-",
        },
        {
            header: "Main Category",
            accessor: "mainCategoryInfo",
            render: (category) => category.mainCategoryInfo?.name || "-",
        },
        {
            header: "Sub Category",
            accessor: "subCategoryInfo",
            render: (category) => category.subCategoryInfo?.name || "-",
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
                    <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                </label>
            ),
        },
        {
            header: "Actions",
            accessor: "id",
            render: (category) => (
                <div className="flex items-center space-x-5">
                    <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                        title="Edit Leaf Category"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-red-500"
                        title={category.isActive ? "Published leaf categories cannot be deleted" : "Delete Leaf Category"}
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
                data={categories}
                isLoading={isLoading}
                expandable
                page={page}
                limit={limit}
                totalRows={totalRows}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                    void fetchData(newPage);
                }}
                renderExpandedRow={(category) => (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
                        <div className="space-y-5">
                            {category.imagePath && (
                                <div>
                                    <h3 className="font-semibold mb-2">Image</h3>
                                    <Image
                                        src={category.imagePath}
                                        alt={category.name}
                                        width={200}
                                        height={120}
                                        className="rounded-lg border object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <span className="font-semibold">Slug:</span>
                                <p className="text-blue-600">{category.leafSlug}</p>
                            </div>
                            {category.description && (
                                <div>
                                    <span className="font-semibold">Description:</span>
                                    <p className="text-gray-600">{category.description}</p>
                                </div>
                            )}
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
                message={`Are you sure you want to ${publishTarget?.isActive ? "unpublish" : "publish"} this leaf category?`}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDeleteCategory}
                message={`Are you sure you want to delete ${deleteTarget?.name || "this leaf category"}?`}
            />

            {selectedEditCategory && (
                <EditLeafCategoryModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedEditCategory(null);
                    }}
                    reloadData={() => fetchData(page)}
                    initialValues={selectedEditCategory}
                />
            )}
        </>
    );
};

export default LeafCategoriesTable;
