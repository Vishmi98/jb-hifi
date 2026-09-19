'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Edit, Loader2, Plus, Trash, Trash2 } from 'lucide-react';

import EditBrandModal from './EditBrandModal';
import { AddBannerModal } from './AddBannerModal';
import { AddRedirectPathModal } from './AddRedirectPathModal';
import { AddCollectionModal } from './AddCollectionsModal';
import { BrandDataType, UpdateBrandRedirectPathPayload } from '../../brand.types';
import { deleteBrand, deleteBrandCollection, getBrands, publishBrand, updateBrandRedirectPath } from '../../brand.service';

import CommonTable, { ColumnType } from '@/components/CommonTable';
import { ConfirmModal } from '@/components/ConfirmModal';
import { TableProps } from '@/constants/types';


const BrandsTable: React.FC<TableProps> = ({ reload }) => {
    const [brands, setBrands] = useState<BrandDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [publishTarget, setPublishTarget] = useState<BrandDataType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<BrandDataType | null>(null);
    const [selectedEditBrand, setSelectedEditBrand] = useState<BrandDataType | null>(null);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [bannerTarget, setBannerTarget] = useState<BrandDataType | null>(null);
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [collectionTarget, setCollectionTarget] = useState<BrandDataType | null>(null);
    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
    const [deletingCollectionKey, setDeletingCollectionKey] = useState<string | null>(null);
    const [deleteCollectionTarget, setDeleteCollectionTarget] = useState<{
        brandId: number;
        collectionId?: string;
        imagePathId?: string;
        index: number;
    } | null>(null);
    const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);
    const [redirectPathTarget, setRedirectPathTarget] = useState<BrandDataType | null>(null);
    const [isRedirectPathModalOpen, setIsRedirectPathModalOpen] = useState(false);

    const handleAddRedirectPath = (brand: BrandDataType) => {
        setRedirectPathTarget(brand);
        setIsRedirectPathModalOpen(true);
    };

    const fetchData = async (paramPage?: number) => {
        setIsLoading(true);
        try {
            const currentPage = paramPage ?? page;
            const response = await getBrands(currentPage, limit);

            if (response.success) {
                setBrands(response.brands);
                setTotalRows(response.totalBrands);
                setTotalPages(response.totalPages);
                setPage(currentPage);
            } else {
                setBrands([]);
            }
        } catch {
            setBrands([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [reload, page]);
    
    const handlePublishToggle = (brand: BrandDataType) => {
        setPublishTarget(brand);
        setIsPublishModalOpen(true);
    };

    const handleAddBanner = (brand: BrandDataType) => {
        setBannerTarget(brand);
        setIsBannerModalOpen(true);
    };

    const confirmPublishToggle = async () => {
        if (!publishTarget) return;

        try {
            const response = await publishBrand(publishTarget.id, !publishTarget.isActive);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error('Failed to update brand publish state:', error);
        } finally {
            setIsPublishModalOpen(false);
            setPublishTarget(null);
        }
    };

    const handleEditBrand = (brand: BrandDataType) => {
        setSelectedEditBrand(brand);
        setIsEditModalOpen(true);
    };

    const handleDeleteBrand = (brand: BrandDataType) => {
        setDeleteTarget(brand);
        setIsDeleteModalOpen(true);
    };

    const handleAddCollection = (brand: BrandDataType) => {
        setCollectionTarget(brand);
        setIsCollectionModalOpen(true);
    };

    const confirmDeleteBrand = async () => {
        if (!deleteTarget) return;

        try {
            const response = await deleteBrand(deleteTarget.id);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error('Failed to delete brand:', error);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const handleConfirmDeleteCollection = async () => {
        if (!deleteCollectionTarget) return;

        const { brandId, collectionId, imagePathId, index } = deleteCollectionTarget;
        const key = `${brandId}-${collectionId || imagePathId || index}`;
        setDeletingCollectionKey(key);

        try {
            const res = await deleteBrandCollection({
                brandId,
                collectionId,
                imagePathId,
                index,
            });

            if (res.success) {
                await fetchData(page);
            } else {
                alert(res.message || "Failed to delete collection.");
            }
        } catch (error) {
            console.error("Collection deletion error:", error);
        } finally {
            setDeletingCollectionKey(null);
            setIsDeleteCollectionModalOpen(false);
            setDeleteCollectionTarget(null);
        }
    };

    const columns: ColumnType<BrandDataType>[] = [
        {
            header: 'Brand',
            accessor: 'name',
            render: (brand) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        {brand.logo ? (
                            <Image
                                src={brand.logo}
                                alt={`${brand.name} logo`}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-gray-400">
                                NO LOGO
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{brand.name}</p>
                    </div>
                </div>
            ),
        },
        {
            header: 'Publish',
            accessor: 'isActive',
            render: (brand) => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={brand.isActive}
                        className="sr-only peer"
                        onChange={() => handlePublishToggle(brand)}
                    />
                    <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                </label>
            ),
        },
        {
            header: "Re direct path",
            accessor: "",
            render: (brand) => {
                const isRedirectDisabled = brand.haveSinglePage; // Enable only when haveSinglePage === false

                return (
                    <button
                        onClick={() => handleAddRedirectPath(brand)}
                        disabled={isRedirectDisabled}
                        title={
                            isRedirectDisabled
                                ? "Redirect path is not applicable for brands with single pages"
                                : "Add Redirect Path"
                        }
                        className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                    >
                        <Plus size={12} /> Add
                    </button>
                );
            }
        },
        {
            header: "Banners",
            accessor: "",
            render: (brand) => (
                <button
                    onClick={() => handleAddBanner(brand)}
                    className="bg-black hover:bg-gray-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                >
                    <Plus size={12} /> Add ({brand.bannerImages?.length || 0})
                </button>
            )
        },
        {
            header: "Collections",
            accessor: "",
            render: (brand) => (
                <button
                    onClick={() => handleAddCollection(brand)}
                    className="bg-black hover:bg-gray-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors"
                >
                    <Plus size={12} /> Add ({brand.collections?.length || 0})
                </button>
            )
        },
        {
            header: 'Actions',
            accessor: 'id',
            render: (brand) => (
                <div className="flex items-center space-x-5">
                    <button
                        onClick={() => handleEditBrand(brand)}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                        title="Edit Brand"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteBrand(brand)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-red-500"
                        title={brand.isActive ? 'Published brands cannot be deleted' : 'Delete Brand'}
                        disabled={brand.isActive}
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            ),
        }
    ];

    return (
        <>
            <CommonTable
                columns={columns}
                data={brands}
                isLoading={isLoading}
                expandable
                page={page}
                limit={limit}
                totalRows={totalRows}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                renderExpandedRow={(brand) => (
                    <div className="space-y-6 p-4 bg-gray-50/50 rounded-lg">
                        {/* Core Info & Media Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Logo Section */}
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Logo
                                </h4>
                                {brand.logo ? (
                                    <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white">
                                        <Image
                                            src={brand.logo}
                                            alt={brand.name}
                                            fill
                                            className="object-contain p-2"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No logo provided</p>
                                )}
                            </div>

                            {/* General Meta Details */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    General Details
                                </h4>
                                <div>
                                    <span className="text-xs text-gray-500 block">Slug</span>
                                    <p className="text-sm font-medium text-blue-600">{brand.slug}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500 block">Featured Status</span>
                                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded ${brand.isFeatured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {brand.isFeatured ? 'Featured' : 'Standard'}
                                    </span>
                                </div>
                                {brand.videoLink && (
                                    <div>
                                        <span className="text-xs text-gray-500 block">Video Link</span>
                                        <a
                                            href={brand.videoLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm text-blue-600 hover:underline break-all"
                                        >
                                            {brand.videoLink}
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Short Description
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed bg-white p-3 rounded border border-gray-100">
                                    {brand.shortDescription || 'No description available.'}
                                </p>
                            </div>
                        </div>

                        {/* Banner Images Section */}
                        {brand.bannerImages && brand.bannerImages.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Banner Images ({brand.bannerImages.length})
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {brand.bannerImages.map((bannerUrl, idx) => (
                                        <div key={idx} className="relative h-20 overflow-hidden rounded-md border border-gray-200 bg-white">
                                            <Image
                                                src={bannerUrl}
                                                alt={`${brand.name} banner ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Collections Section */}
                        {brand.collections && brand.collections.length > 0 && (
                            <div>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                    Collections ({brand.collections.length})
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {brand.collections.map((item, index) => {
                                        const uniqueKey = `${brand.id}-${item._id || item.imagePathId || index}`;
                                        const isDeletingThis = deletingCollectionKey === uniqueKey;

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between gap-3 p-2.5 bg-white rounded-md border border-gray-200 shadow-sm relative group"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    {item.imagePath ? (
                                                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-100">
                                                            <Image
                                                                src={item.imagePath}
                                                                alt="Collection thumbnail"
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="h-12 w-12 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-[9px] text-gray-400">
                                                            NO IMG
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 text-xs space-y-0.5">
                                                        <p className="font-medium text-gray-800 truncate">
                                                            {item.mainCategoryInfo?.name ||
                                                                item.categoryInfo?.name ||
                                                                item.subCategoryInfo?.name ||
                                                                `Collection #${index + 1}`}
                                                        </p>
                                                        {item.compareLink && (
                                                            <a
                                                                href={item.compareLink}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-blue-500 hover:underline block truncate text-[11px]"
                                                            >
                                                                Compare Link
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Delete button per collection item */}
                                                <button
                                                    onClick={() => {
                                                        setDeleteCollectionTarget({
                                                            brandId: brand.id,
                                                            collectionId: item._id,
                                                            imagePathId: item.imagePathId,
                                                            index,
                                                        });
                                                        setIsDeleteCollectionModalOpen(true);
                                                    }}
                                                    disabled={isDeletingThis}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete collection item"
                                                >
                                                    {isDeletingThis ? (
                                                        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                emptyMessage="No brands found"
            />

            <ConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => {
                    setIsPublishModalOpen(false);
                    setPublishTarget(null);
                }}
                onConfirm={confirmPublishToggle}
                message={`Are you sure you want to ${publishTarget?.isActive ? 'unpublish' : 'publish'} this brand?`}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDeleteBrand}
                message={`Are you sure you want to delete ${deleteTarget?.name || 'this brand'}?`}
            />

            <ConfirmModal
                isOpen={isDeleteCollectionModalOpen}
                onClose={() => {
                    setIsDeleteCollectionModalOpen(false);
                    setDeleteCollectionTarget(null);
                }}
                onConfirm={handleConfirmDeleteCollection}
                message="Are you sure you want to delete this collection item? This action will also delete the associated image."
            />

            {selectedEditBrand && (
                <EditBrandModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedEditBrand(null);
                    }}
                    reloadData={() => fetchData(page)}
                    initialValues={selectedEditBrand}
                />
            )}

            <AddBannerModal
                isOpen={isBannerModalOpen}
                onClose={() => {
                    setIsBannerModalOpen(false);
                    setBannerTarget(null);
                }}
                brand={bannerTarget}
                reloadData={() => fetchData(page)}
            />

            <AddCollectionModal
                isOpen={isCollectionModalOpen}
                onClose={() => {
                    setIsCollectionModalOpen(false);
                    setCollectionTarget(null);
                }}
                brand={collectionTarget}
                reloadData={() => fetchData(page)}
            />

            {redirectPathTarget && (
                <AddRedirectPathModal
                    isOpen={isRedirectPathModalOpen}
                    onClose={() => {
                        setIsRedirectPathModalOpen(false);
                        setRedirectPathTarget(null);
                    }}
                    brand={redirectPathTarget}
                    onSubmit={async (payload: UpdateBrandRedirectPathPayload) => {
                        const res = await updateBrandRedirectPath(payload);
                        if (res.success) {
                            await fetchData(page);
                        } else {
                            alert(res.message || "Failed to update redirect path");
                        }
                    }}
                />
            )}
        </>
    );
};

export default BrandsTable;
