'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Edit, Plus, Trash, Tag, CreditCard, Store, Building2, Sparkles, Star, Package, Video, CheckCircle2, } from 'lucide-react';

import EditProductModal from './EditProductModal';
import { AddImagesModal } from './AddImages';
import { AddProductVariantModal } from './AddProductVariant';
import { EditProductVariantModal } from './EditProductVariant';
import { DescriptionDataType, ProductDataType, ProductVariantDataType } from '../../products.types';
import { deleteProduct, deleteProductImage, deleteProductVariant, getProducts, publishProduct } from '../../products.service';

import CommonTable, { ColumnType } from '@/components/CommonTable';
import { ConfirmModal } from '@/components/ConfirmModal';
import { TableProps } from '@/constants/types';
import { AddDescriptionModal } from './AddDescription';
import { EditDescriptionModal } from './EditDescription';


const ProductsTable: React.FC<TableProps> = ({ reload }) => {
    const [products, setProducts] = useState<ProductDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [limit] = useState(5);

    const [totalRows, setTotalRows] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [publishTarget, setPublishTarget] = useState<ProductDataType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ProductDataType | null>(null);
    const [selectedEditProduct, setSelectedEditProduct] = useState<ProductDataType | null>(null);

    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedImageProduct, setSelectedImageProduct] = useState<ProductDataType | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [deleteImageTarget, setDeleteImageTarget] = useState<{
        productId: string | number;
        imgUrl: string;
        index: number;
    } | null>(null);
    const [isDeleteImageModalOpen, setIsDeleteImageModalOpen] = useState(false);
    const [selectedVariantProduct, setSelectedVariantProduct] = useState<ProductDataType | null>(null);
    const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);
    const [isEditVariantModalOpen, setIsEditVariantModalOpen] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariantDataType | null>(null);
    const [deleteVariantTarget, setDeleteVariantTarget] = useState<{
        product: ProductDataType;
        variant: ProductVariantDataType;
    } | null>(null);
    const [isDeleteVariantModalOpen, setIsDeleteVariantModalOpen] = useState(false);
    const [isDeletingVariant, setIsDeletingVariant] = useState(false);
    // Description Modal State
    const [selectedDescriptionProduct, setSelectedDescriptionProduct] = useState<ProductDataType | null>(null);
    const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);
    const [selectedEditDescription, setSelectedEditDescription] = useState<DescriptionDataType | null>(null);
    const [isEditDescriptionModalOpen, setIsEditDescriptionModalOpen] = useState(false);

    const fetchData = async (paramPage?: number) => {
        setIsLoading(true);
        try {
            const currentPage = paramPage ?? page;
            const response = await getProducts(currentPage, limit);

            if (response.success) {
                setProducts(response.products);
                setTotalRows(response.totalProducts);
                setTotalPages(response.totalPages);
                setPage(currentPage);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(page);
    }, [reload, page]);

    const handlePublishToggle = (product: ProductDataType) => {
        setPublishTarget(product);
        setIsPublishModalOpen(true);
    };

    const confirmPublishToggle = async () => {
        if (!publishTarget) return;

        try {
            const response = await publishProduct(publishTarget.id, !publishTarget.isActive);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to update product publish state:", error);
        } finally {
            setIsPublishModalOpen(false);
            setPublishTarget(null);
        }
    };

    const handleEditProduct = (product: ProductDataType) => {
        setSelectedEditProduct(product);
        setIsEditModalOpen(true);
    };

    const handleDeleteProduct = (product: ProductDataType) => {
        setDeleteTarget(product);
        setIsDeleteModalOpen(true);
    };

    const handleAddImages = (product: ProductDataType) => {
        setSelectedImageProduct(product);
        setIsImageModalOpen(true);
    };

    const handleAddVariant = (product: ProductDataType) => {
        setSelectedVariantProduct(product);
        setIsVariantModalOpen(true);
    };

    const handleEditVariant = (product: ProductDataType, variant: ProductVariantDataType) => {
        setSelectedVariantProduct(product);
        setSelectedVariant(variant);
        setIsEditVariantModalOpen(true);
    };

    const handleRequestDeleteVariant = (product: ProductDataType, variant: ProductVariantDataType) => {
        setDeleteVariantTarget({ product, variant });
        setIsDeleteVariantModalOpen(true);
    };

    const handleAddDescription = (product: ProductDataType) => {
        setSelectedDescriptionProduct(product);
        setIsDescriptionModalOpen(true);
    };

    const handleEditDescription = (product: ProductDataType) => {
        setSelectedDescriptionProduct(product);
        // Pass product.description instead of product itself
        setSelectedEditDescription(product.description || null);
        setIsEditDescriptionModalOpen(true);
    };

    const confirmDeleteProduct = async () => {
        if (!deleteTarget) return;

        try {
            const response = await deleteProduct(deleteTarget.id);

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to delete product:", error);
        } finally {
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
        }
    };

    const confirmDeleteVariant = async () => {
        if (!deleteVariantTarget) return;

        setIsDeletingVariant(true);
        try {
            const response = await deleteProductVariant({
                productId: deleteVariantTarget.product.id,
                variantId: deleteVariantTarget.variant.id,
            });

            if (response?.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to delete product variant:", error);
        } finally {
            setIsDeletingVariant(false);
            setIsDeleteVariantModalOpen(false);
            setDeleteVariantTarget(null);
        }
    };

    const handleRequestDeleteImage = (
        productId: string | number,
        imgUrl: string,
        index: number
    ) => {
        setDeleteImageTarget({ productId, imgUrl, index });
        setIsDeleteImageModalOpen(true);
    };

    const confirmDeleteImage = async () => {
        if (!deleteImageTarget) return;

        try {
            const response = await deleteProductImage({
                productId: deleteImageTarget.productId,
                imageUrl: deleteImageTarget.imgUrl,
                index: deleteImageTarget.index,
            });

            if (response.success) {
                await fetchData(page);
            }
        } catch (error) {
            console.error("Failed to delete image:", error);
        } finally {
            setIsDeleteImageModalOpen(false);
            setDeleteImageTarget(null);
        }
    };

    const columns: ColumnType<ProductDataType>[] = [
        {
            header: "Product",
            accessor: "mainImage",
            render: (product) => (
                <div className="flex items-center gap-3">
                    <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                        {product.mainImage ? (
                            <Image
                                src={product.mainImage}
                                alt={`${product.title} mainImage`}
                                fill
                                className="object-contain p-1"
                                sizes="64px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-gray-400">
                                NO Image
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span
                            className="block max-w-[180px] truncate font-semibold text-gray-900 text-sm"
                            title={product.title}
                        >
                            {product.title}
                        </span>
                        <span className="text-[11px] text-gray-500 truncate">
                            {product.brandInfo?.name || "No Brand"}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            header: "Publish",
            accessor: "isActive",
            render: (product) => (
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={product.isActive}
                        className="sr-only peer"
                        onChange={() => handlePublishToggle(product)}
                    />
                    <div className="relative w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:border after:border-gray-300 after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                </label>
            ),
        },
        {
            header: "Images",
            accessor: "",
            render: (product) => (
                <button
                    onClick={() => handleAddImages(product)}
                    className="bg-black hover:bg-gray-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                    <Plus size={12} /> Add
                </button>
            ),
        },
        {
            header: "Description",
            accessor: "",
            render: (product) => (
                <button
                    onClick={() => handleAddDescription(product)}
                    className="bg-black hover:bg-gray-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                    <Plus size={12} /> Add
                </button>
            ),
        },
        {
            header: "Variants",
            accessor: "",
            render: (product) => (
                <button
                    onClick={() => handleAddVariant(product)}
                    className="bg-black hover:bg-gray-800 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                    <Plus size={12} /> Add
                </button>
            ),
        },
        {
            header: "Actions",
            accessor: "id",
            render: (product) => (
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                        title="Edit Product"
                    >
                        <Edit className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-red-500"
                        title={
                            product.isActive
                                ? "Published products cannot be deleted"
                                : "Delete Product"
                        }
                        disabled={product.isActive}
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
                data={products}
                isLoading={isLoading}
                expandable
                page={page}
                limit={limit}
                totalRows={totalRows}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
                renderExpandedRow={(product) => (
                    <div className="mx-auto w-full space-y-2 text-xs text-gray-700">
                        {/* 1. Header Banner & Key Flags */}
                        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                                            ID: #{product.id}
                                        </span>
                                        <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-mono text-gray-600">
                                            /{product.slug}
                                        </span>
                                        {product.isActive ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-medium text-rose-700">
                                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Inactive
                                            </span>
                                        )}
                                        {product.isFeatured && (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                                                <Sparkles className="h-3 w-3 text-amber-500" /> Featured
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-xl font-bold text-gray-900">{product.title || "Untitled Product"}</h1>
                                </div>

                                {/* Quick Metrics */}
                                <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-3 text-gray-600 border border-gray-100">
                                    <div className="flex items-center gap-1.5 border-r border-gray-200 pr-4">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <div>
                                            <span className="block text-[10px] uppercase font-semibold text-gray-400">Rating</span>
                                            <span className="font-bold text-gray-800 text-sm">{product.ratings ?? 0} / 5</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold text-gray-400">Reviews</span>
                                        <span className="font-bold text-gray-800 text-sm">{product.reviews?.length || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Main Media & Details Grid */}
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                            {/* Main Image Showcase */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Primary Cover Image
                                </span>
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100">
                                    {product.mainImage ? (
                                        <Image
                                            src={product.mainImage}
                                            alt={product.title}
                                            fill
                                            className="object-contain p-2"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-gray-400 italic">
                                            No main image uploaded
                                        </div>
                                    )}
                                </div>
                                {product.mainImageId && (
                                    <p className="mt-2 text-[10px] font-mono text-gray-400 truncate">
                                        ID: {product.mainImageId}
                                    </p>
                                )}
                            </div>

                            {/* Categorization & Metadata */}
                            <div className="lg:col-span-2 space-y-2">
                                {/* Category Breadcrumb Card */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                        Category Hierarchy
                                    </span>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                                            <span className="block text-[10px] font-semibold text-gray-400 uppercase">Main</span>
                                            <span className="font-semibold text-gray-800">
                                                {product.mainCategoryInfo?.name || `#${product.mainCategoryId || "-"}`}
                                            </span>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                                            <span className="block text-[10px] font-semibold text-gray-400 uppercase">Category</span>
                                            <span className="font-semibold text-gray-800">
                                                {product.categoryInfo?.name || `#${product.categoryId || "-"}`}
                                            </span>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                                            <span className="block text-[10px] font-semibold text-gray-400 uppercase">Sub</span>
                                            <span className="font-semibold text-gray-800">
                                                {product.subCategoryInfo?.name || `#${product.subCategoryId || "-"}`}
                                            </span>
                                        </div>
                                        <div className="rounded-lg bg-gray-50 p-2.5 border border-gray-100">
                                            <span className="block text-[10px] font-semibold text-gray-400 uppercase">Leaf</span>
                                            <span className="font-semibold text-gray-800">
                                                {product.leafCategoryInfo?.name || `#${product.leafCategoryId || "-"}`}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Brand, Store, Payment & Commerce Meta */}
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                        Store & Vendor Metadata
                                    </span>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                                            <div>
                                                <span className="block text-[10px] font-semibold text-gray-400 uppercase">Brand</span>
                                                <span className="font-medium text-gray-800">
                                                    {product.brandInfo?.name || `#${product.brandId || "-"}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Store className="h-4 w-4 text-gray-400 shrink-0" />
                                            <div>
                                                <span className="block text-[10px] font-semibold text-gray-400 uppercase">Store</span>
                                                <span className="font-medium text-gray-800">
                                                    {product.storeInfo?.name || `#${product.storeId || "-"}`}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4 text-gray-400 shrink-0" />
                                            <div>
                                                <span className="block text-[10px] font-semibold text-gray-400 uppercase">Sell Type</span>
                                                <span className="font-medium text-gray-800">
                                                    {product.sellTypeInfo?.name || `#${product.sellType}`}
                                                </span>
                                            </div>
                                        </div>

                                        {product.tagLineInfo && (
                                            <div className="flex items-center gap-2 sm:col-span-2">
                                                <Tag className="h-4 w-4 text-gray-400 shrink-0" />
                                                <div>
                                                    <span className="block text-[10px] font-semibold text-gray-400 uppercase">Tagline</span>
                                                    <span className="font-medium text-gray-800">{product.tagLineInfo.name}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Payment Methods Info */}
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <span className="block text-[10px] font-semibold uppercase text-gray-400 mb-1.5">
                                            Accepted Payment Methods
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {product.paymentMethodsInfo && product.paymentMethodsInfo.length > 0 ? (
                                                product.paymentMethodsInfo.map((method, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                                                    >
                                                        <CreditCard className="h-3 w-3 text-gray-400" />
                                                        {method.name}
                                                    </span>
                                                ))
                                            ) : product.paymentMethods && product.paymentMethods.length > 0 ? (
                                                product.paymentMethods.map((id, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-700"
                                                    >
                                                        <CreditCard className="h-3 w-3 text-gray-400" /> Method #{id}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 italic">No specific payment methods configured</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Product Gallery */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                            <span className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                Gallery Images ({product.images?.length || 0})
                            </span>
                            {product.images && product.images.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {product.images.map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative h-28 w-24 overflow-hidden"
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={`${product.title} gallery preview ${idx + 1}`}
                                                fill
                                                className="object-contain transition-transform duration-200 group-hover:scale-105"
                                                sizes="96px"
                                            />
                                            {handleRequestDeleteImage && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRequestDeleteImage(product.id, imgUrl, idx)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 text-white"
                                                    title="Delete image"
                                                >
                                                    <Trash className="h-4 w-4 text-red-400 hover:text-red-300" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No additional gallery images uploaded.</p>
                            )}
                        </div>

                        {/* 4. Detailed Description, Paragraphs & Features */}
                        <div className="grid grid-cols-1 gap-2">
                            {/* Description Card */}
                            <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <div className="space-y-3">
                                    <div className='flex items-center justify-between w-full'>
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                            Description
                                        </span>
                                        <button
                                            onClick={() => handleEditDescription(product)}
                                            className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {product?.description?.paragraph1 ||
                                        product?.description?.paragraph2 ||
                                        product?.description?.paragraph3 ? (
                                        <div className="space-y-2.5 text-sm text-gray-600 leading-relaxed">
                                            {product.description.paragraph1 && (
                                                <p>{product.description.paragraph1}</p>
                                            )}
                                            {product.description.paragraph2 && (
                                                <p>{product.description.paragraph2}</p>
                                            )}
                                            {product.description.paragraph3 && (
                                                <p>{product.description.paragraph3}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">
                                            No paragraph descriptions available.
                                        </p>
                                    )}
                                </div>

                                {/* Video URL Link */}
                                {product?.description?.videoUrl && (
                                    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-gray-100 text-blue-600">
                                        <Video className="h-4 w-4 shrink-0" />
                                        <a
                                            href={product.description.videoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="hover:underline truncate text-xs font-medium"
                                        >
                                            Watch Product Video
                                        </a>
                                    </div>
                                )}
                                {/* Complex features from description */}
                                {product.description?.features && product.description.features.length > 0 && (
                                    <div className="space-y-2 pt-2 border-t border-gray-100">
                                        <span className="block text-[10px] font-semibold text-gray-400">Detailed Features</span>
                                        {product.description.features.map((feat, idx) => (
                                            <div key={idx} className="rounded-lg bg-gray-50 p-2 border border-gray-100">
                                                <span className="font-semibold text-gray-800 block">{feat.title}</span>
                                                <span className="text-gray-600 block mt-0.5">{feat.description}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>

                            {/* Structured Features list */}
                            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                                <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Key Highlights & Features
                                </span>

                                {/* Simple string list keyFeatures */}
                                {product.keyFeatures && product.keyFeatures.length > 0 && (
                                    <ul className="space-y-1.5 mb-3">
                                        {product.keyFeatures.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-gray-700">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {(!product.keyFeatures || product.keyFeatures.length === 0) &&
                                    (!product.description?.features || product.description.features.length === 0) && (
                                        <p className="text-gray-400 italic">No feature highlights recorded.</p>
                                    )}
                            </div>
                        </div>

                        {/* 5. Product Variants Table */}
                        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                                    Product Variants ({product.variants?.length || 0})
                                </span>
                            </div>

                            {product.variants && product.variants.length > 0 ? (
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 font-medium text-gray-600 border-b border-gray-200">
                                                <th className="p-2.5">Variant Details</th>
                                                <th className="p-2.5">SKU / Model</th>
                                                <th className="p-2.5">Color</th>
                                                <th className="p-2.5">Pricing</th>
                                                <th className="p-2.5">Stock</th>
                                                <th className="p-2.5">Specifications</th>
                                                <th className="p-2.5 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 text-gray-700">
                                            {product.variants.map((variant, idx) => (
                                                <tr key={variant.id || idx} className="hover:bg-gray-50/80 transition-colors">
                                                    {/* Image & ID */}
                                                    <td className="p-2.5">
                                                        <div className="flex items-center gap-2">
                                                            {variant.imagePath ? (
                                                                <div className="relative h-9 w-9 rounded border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                                                                    <Image
                                                                        src={variant.imagePath}
                                                                        alt={variant.productModel || "Variant image"}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="h-9 w-9 rounded bg-gray-100 flex items-center justify-center text-gray-400 text-[9px] shrink-0">
                                                                    No Img
                                                                </div>
                                                            )}
                                                            <div>
                                                                <span className="font-semibold block text-gray-900">
                                                                    #{variant.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* SKU & Model */}
                                                    <td className="p-2.5 font-mono">
                                                        <span className="block font-medium text-gray-800">
                                                            {variant.productModel || "-"}
                                                        </span>
                                                        <span className="text-[10px] text-gray-400 block">
                                                            SKU: {variant.sku || "-"}
                                                        </span>
                                                    </td>

                                                    {/* Color */}
                                                    <td className="p-2.5">
                                                        {variant.color ? (
                                                            <div className="flex items-center gap-1.5">
                                                                {variant.colorHexCode && (
                                                                    <span
                                                                        className="h-3.5 w-3.5 rounded-full border border-gray-300 shrink-0"
                                                                        style={{ backgroundColor: variant.colorHexCode }}
                                                                        title={variant.colorHexCode}
                                                                    />
                                                                )}
                                                                <span>{variant.color}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>

                                                    {/* Pricing */}
                                                    <td className="p-2.5">
                                                        {(variant.originalPrice > 0 && variant.originalPrice !== variant.price) && variant.price > 0 && (
                                                            <>
                                                                <span className="font-bold text-gray-900 block">
                                                                    ${variant.price ? variant.price.toFixed(2) : "0.00"}
                                                                </span>
                                                                <span className="text-[10px] text-gray-400 line-through block">
                                                                    ${variant.originalPrice.toFixed(2)}
                                                                </span>
                                                            </>
                                                        )}
                                                        {variant.originalPrice > 0 && variant.price === 0 && (
                                                            <span className="font-bold text-gray-900 block">
                                                                ${variant.originalPrice.toFixed(2)}
                                                            </span>
                                                        )}
                                                        {variant.additionalPrice > 0 && (
                                                            <span className="text-[10px] text-blue-600 block">
                                                                +${variant.additionalPrice.toFixed(2)} extra
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* Stock */}
                                                    <td className="p-2.5">
                                                        {variant.stockCount > 0 ? (
                                                            <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                                                                {variant.stockCount} in stock
                                                            </span>
                                                        ) : (
                                                            <>_</>
                                                        )}
                                                    </td>

                                                    {/* Specs Summary */}
                                                    <td className="p-2.5">
                                                        {variant.specifications && variant.specifications.length > 0 ? (
                                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                                {variant.specifications.map((spec, sIdx) => (
                                                                    <span
                                                                        key={sIdx}
                                                                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                                                                    >
                                                                        <strong className="text-gray-800">{spec.name}:</strong> {spec.value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 italic">None</span>
                                                        )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="p-2.5 text-right">
                                                        {handleEditVariant && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleEditVariant(product, variant)}
                                                                className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                                                                title="Edit Variant"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleRequestDeleteVariant(product, variant)}
                                                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:text-red-500"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">No variants available for this product.</p>
                            )}
                        </div>

                        {/* 6. Tags & Footer Meta */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                <Tag className="h-4 w-4 text-gray-400 shrink-0" />
                                <div className="flex flex-wrap gap-1.5">
                                    {product.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 border border-gray-200"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                emptyMessage="No products found"
            />

            {/* Modals section */}
            <ConfirmModal
                isOpen={isPublishModalOpen}
                onClose={() => {
                    setIsPublishModalOpen(false);
                    setPublishTarget(null);
                }}
                onConfirm={confirmPublishToggle}
                message={`Are you sure you want to ${publishTarget?.isActive ? "unpublish" : "publish"
                    } this product?`}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                }}
                onConfirm={confirmDeleteProduct}
                message={`Are you sure you want to delete ${deleteTarget?.title || "this product"
                    }?`}
            />

            {selectedEditProduct && (
                <EditProductModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedEditProduct(null);
                    }}
                    reloadData={() => fetchData(page)}
                    initialValues={selectedEditProduct}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteImageModalOpen}
                onClose={() => {
                    setIsDeleteImageModalOpen(false);
                    setDeleteImageTarget(null);
                }}
                onConfirm={confirmDeleteImage}
                message="Are you sure you want to delete this image?"
            />

            <ConfirmModal
                isOpen={isDeleteVariantModalOpen}
                onClose={() => {
                    setIsDeleteVariantModalOpen(false);
                    setDeleteVariantTarget(null);
                }}
                onConfirm={confirmDeleteVariant}
                message="Are you sure you want to delete this variant?"
            />

            <AddImagesModal
                isOpen={isImageModalOpen}
                onClose={() => {
                    setIsImageModalOpen(false);
                    setSelectedImageProduct(null);
                }}
                product={selectedImageProduct}
                reloadData={() => fetchData(page)}
            />

            <AddProductVariantModal
                isOpen={isVariantModalOpen}
                onClose={() => {
                    setIsVariantModalOpen(false);
                    setSelectedVariantProduct(null);
                }}
                product={selectedVariantProduct}
                reloadData={() => fetchData(page)}
            />

            <EditProductVariantModal
                isOpen={isEditVariantModalOpen}
                onClose={() => {
                    setIsEditVariantModalOpen(false);
                    setSelectedVariantProduct(null);
                    setSelectedVariant(null);
                }}
                product={selectedVariantProduct}
                initialValues={selectedVariant}
                reloadData={() => fetchData(page)}
            />

            <AddDescriptionModal
                isOpen={isDescriptionModalOpen}
                onClose={() => {
                    setIsDescriptionModalOpen(false);
                    setSelectedDescriptionProduct(null);
                }}
                product={selectedDescriptionProduct}
                reloadData={() => fetchData(page)}
            />

            <EditDescriptionModal
                isOpen={isEditDescriptionModalOpen}
                product={selectedDescriptionProduct}
                initialValues={selectedEditDescription}
                onClose={() => {
                    setIsEditDescriptionModalOpen(false);
                    setSelectedEditDescription(null);
                    setSelectedDescriptionProduct(null);
                }}
                reloadData={() => fetchData(page)}
            />
        </>
    );
};

export default ProductsTable;