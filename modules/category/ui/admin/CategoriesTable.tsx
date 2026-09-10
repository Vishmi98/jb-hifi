"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Edit, Trash } from "lucide-react";

import EditCategoryModal from "./EditCategoryModal";
import { CategoryDataType } from "../../category.types";
import { deleteCategory, getCategories, publishCategory } from "../../category.service";

import { TableProps } from "@/constants/types";
import CommonTable, { ColumnType } from "@/components/CommonTable";
import { ConfirmModal } from "@/components/ConfirmModal";


const CategoriesTable: React.FC<TableProps> = ({ reload }) => {
  const [categories, setCategories] = useState<CategoryDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [publishTarget, setPublishTarget] = useState<CategoryDataType | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CategoryDataType | null>(null);
  const [selectedEditCategory, setSelectedEditCategory] = useState<CategoryDataType | null>(null);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchData = async (paramPage?: number) => {
    setIsLoading(true);
    try {
      const currentPage = paramPage ?? page;
      const response = await getCategories(currentPage, limit);

      if (response.success) {
        setCategories(response.categories);
        setTotalRows(response.totalCategories);
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
  };

  useEffect(() => {
    fetchData(page);
  }, [reload, page]);

  const handlePublishToggle = (category: CategoryDataType) => {
    setPublishTarget(category);
    setIsPublishModalOpen(true);
  };

  const confirmPublishToggle = async () => {
    if (!publishTarget) return;

    try {
      const response = await publishCategory(publishTarget.id, !publishTarget.isActive);

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

  const handleEditCategory = (category: CategoryDataType) => {
    setSelectedEditCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategory = (category: CategoryDataType) => {
    setDeleteTarget(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!deleteTarget) return;

    try {
      const response = await deleteCategory(deleteTarget.id);

      if (response.success) {
        // Handle fallback to previous page if last item on current page is deleted
        const isLastItemOnPage = categories.length === 1 && page > 1;
        const targetPage = isLastItemOnPage ? page - 1 : page;
        await fetchData(targetPage);
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const columns: ColumnType<CategoryDataType>[] = [
    {
      header: "Name",
      accessor: "name",
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
            onClick={() => handleEditCategory(category)}
            className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
            title="Edit Category"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteCategory(category)}
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
        data={categories}
        isLoading={isLoading}
        expandable
        page={page}
        limit={limit}
        totalRows={totalRows}
        totalPages={totalPages}
        onPageChange={(newPage) => fetchData(newPage)}
        renderExpandedRow={(category) => (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4">
            {/* Image Section */}
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

            {/* Category Details */}
            <div className="space-y-4">
              <div>
                <span className="font-semibold">Slug:</span>
                <p className="text-blue-600">{category.slug}</p>
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

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={confirmDeleteCategory}
        message={`Are you sure you want to delete ${deleteTarget?.name || "this category"
          }?`}
      />

      {/* Edit Modal */}
      {selectedEditCategory && (
        <EditCategoryModal
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

export default CategoriesTable;