'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Edit, Plus, Trash, Tag, } from 'lucide-react';

import EditProductModal from './EditProductModal';
// import { AddSpecificationModal } from './AddSpecifications';
import { AddImagesModal } from './AddImages';
import { AddProductVariantModal } from './AddProductVariant';
import { ProductDataType } from '../../products.types';
import { deleteProduct, deleteProductImage, getProducts, publishProduct } from '../../products.service';

import CommonTable, { ColumnType } from '@/components/CommonTable';
import { ConfirmModal } from '@/components/ConfirmModal';
import { TableProps } from '@/constants/types';


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
    const [selectedSpecProduct, setSelectedSpecProduct] = useState<ProductDataType | null>(null);
    const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
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

    const handleAddSpecification = (product: ProductDataType) => {
        setSelectedSpecProduct(product);
        setIsSpecModalOpen(true);
    };

    const handleAddImages = (product: ProductDataType) => {
        setSelectedImageProduct(product);
        setIsImageModalOpen(true);
    };

    const handleAddVariant = (product: ProductDataType) => {
        setSelectedVariantProduct(product);
        setIsVariantModalOpen(true);
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
            header: "Specification",
            accessor: "",
            render: (product) => (
                <button
                    onClick={() => handleAddSpecification(product)}
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
                    <div className="space-y-4 text-xs">
                        <div>
                            <span className="uppercase font-semibold text-[10px] text-gray-500 block">
                                Title
                            </span>
                            <span className="font-medium text-gray-900 text-sm">
                                {product.title || "-"}
                            </span>
                        </div>

                        {/* Category Breadcrumbs */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-2 rounded-md border border-gray-200">
                            <div>
                                <span className="uppercase font-semibold text-[10px] text-gray-400 block">
                                    Main Category
                                </span>
                                <span className="font-medium text-gray-800">
                                    {product.mainCategoryInfo?.name || "-"}
                                </span>
                            </div>
                            <div>
                                <span className="uppercase font-semibold text-[10px] text-gray-400 block">
                                    Category
                                </span>
                                <span className="font-medium text-gray-800">
                                    {product.categoryInfo?.name || "-"}
                                </span>
                            </div>
                            <div>
                                <span className="uppercase font-semibold text-[10px] text-gray-400 block">
                                    Sub Category
                                </span>
                                <span className="font-medium text-gray-800">
                                    {product.subCategoryInfo?.name || "-"}
                                </span>
                            </div>
                            <div>
                                <span className="uppercase font-semibold text-[10px] text-gray-400 block">
                                    Leaf Category
                                </span>
                                <span className="font-medium text-gray-800">
                                    {product.leafCategoryInfo?.name || "-"}
                                </span>
                            </div>
                        </div>

                        {/* Additional Product Gallery Images */}
                        <div>
                            <span className="font-semibold block text-gray-800">
                                Gallery Images ({product.images?.length || 0})
                            </span>
                            {product.images && product.images.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {product.images.map((imgUrl, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative h-28 w-24 overflow-hidden"
                                        >
                                            <Image
                                                src={imgUrl}
                                                alt={`${product.title} gallery ${idx + 1}`}
                                                fill
                                                className="object-contain"
                                                sizes="80px"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRequestDeleteImage(product.id, imgUrl, idx)
                                                }
                                                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity text-white cursor-pointer"
                                                title="Delete image"
                                            >
                                                <Trash className="w-4 h-4 text-red-400 hover:text-red-300" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">
                                    No additional gallery images uploaded.
                                </p>
                            )}
                        </div>

                        {/* Key Features & First Variant Specifications */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {/* Key Features */}
                            <div className="bg-white p-2 rounded-md border border-gray-200">
                                <span className="font-semibold block text-gray-800">
                                    Key Features
                                </span>
                                {product.keyFeatures && product.keyFeatures.length > 0 ? (
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                        {product.keyFeatures.map((feature, idx) => (
                                            <li key={idx}>{feature}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-400 italic">No key features specified.</p>
                                )}
                            </div>

                            {/* Product Variant Specifications */}
                            <div className="bg-white p-2 rounded-md border border-gray-200">
                                <span className="font-semibold block text-gray-800">
                                    Specifications Summary
                                </span>
                                {product.variants &&
                                    product.variants.some(
                                        (v) => v.specifications && v.specifications.length > 0
                                    ) ? (
                                    <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {product.variants.map((v, vIdx) => (
                                            <div key={vIdx} className="border-b border-gray-100 pb-2 last:border-0">
                                                <p className="font-medium text-gray-700 text-[11px] mb-1">
                                                    Variant: {v.productModel || v.sku || `#${v.id}`}
                                                </p>
                                                <div className="grid grid-cols-2 gap-1 text-gray-600">
                                                    {v.specifications.map((spec, sIdx) => (
                                                        <div key={sIdx} className="truncate">
                                                            <span className="font-semibold text-gray-500">
                                                                {spec.name}:
                                                            </span>{" "}
                                                            {spec.value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        No specifications added to variants yet.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Variants Table */}
                        <div>
                            <span className="font-semibold block text-gray-800">
                                Variants ({product.variants?.length || 0})
                            </span>
                            {product.variants && product.variants.length > 0 ? (
                                <div className="overflow-x-auto border border-gray-200 rounded-md bg-white">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100 font-medium text-gray-700">
                                                <th className="p-2">Model</th>
                                                <th className="p-2">SKU</th>
                                                <th className="p-2">Color</th>
                                                <th className="p-2">Price</th>
                                                <th className="p-2">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 text-gray-600">
                                            {product.variants.map((variant, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-2 font-mono">{variant.productModel || "-"}</td>
                                                    <td className="p-2 font-mono">{variant.sku || "-"}</td>
                                                    <td className="p-2">
                                                        {variant.color ? (
                                                            <div className="flex items-center gap-1.5">
                                                                {variant.colorHexCode && (
                                                                    <span
                                                                        className="w-3 h-3 rounded-full border border-gray-300"
                                                                        style={{ backgroundColor: variant.colorHexCode }}
                                                                    />
                                                                )}
                                                                <span>{variant.color}</span>
                                                            </div>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                    <td className="p-2 font-semibold text-gray-900">
                                                        {variant.price
                                                            ? `$${variant.price.toFixed(2)}`
                                                            : variant.originalPrice
                                                                ? `$${variant.originalPrice.toFixed(2)}`
                                                                : "-"}
                                                    </td>
                                                    <td className="p-2">{variant.stockCount}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-400 italic">
                                    No variants available for this product.
                                </p>
                            )}
                        </div>

                        {/* Meta Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                <Tag className="w-3.5 h-3.5 text-gray-400" />
                                <div className="flex flex-wrap gap-1">
                                    {product.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-[10px] font-medium"
                                        >
                                            {tag}
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

            {/* <AddSpecificationModal
                isOpen={isSpecModalOpen}
                onClose={() => {
                    setIsSpecModalOpen(false);
                    setSelectedSpecProduct(null);
                }}
                product={selectedSpecProduct}
                reloadData={() => fetchData(page)}
            /> */}

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
        </>
    );
};

export default ProductsTable;