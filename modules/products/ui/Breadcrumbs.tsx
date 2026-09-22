'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { BreadcrumbsProps } from '../products.types';


export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
    product,
    currentStorage = '',
    currentColor = '',
}) => {
    const {
        title,
        categoryInfo,
        mainCategoryInfo,
        subCategoryInfo,
        leafCategoryInfo,
    } = product;

    return (
        <nav aria-label="Breadcrumb" className="my-6 hidden md:block">
            <ol className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
                {/* Home Link */}
                <li className="flex items-center gap-1.5">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                </li>

                {/* Category */}
                {categoryInfo?.name && (
                    <li className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Link
                            href={`/collections/${categoryInfo.slug}`}
                            className="hover:underline"
                        >
                            {categoryInfo.name}
                        </Link>
                    </li>
                )}

                {/* Main Category */}
                {mainCategoryInfo?.name && (
                    <li className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Link
                            href={`/collections/${categoryInfo?.slug}/${mainCategoryInfo.mainSlug}`}
                            className="hover:underline"
                        >
                            {mainCategoryInfo.name}
                        </Link>
                    </li>
                )}

                {/* Sub Category */}
                {subCategoryInfo?.name && (
                    <li className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Link
                            href={`/collections/${categoryInfo?.slug}/${mainCategoryInfo?.mainSlug}/${subCategoryInfo.subSlug}`}
                            className="hover:underline"
                        >
                            {subCategoryInfo.name}
                        </Link>
                    </li>
                )}

                {/* Leaf Category */}
                {leafCategoryInfo?.name && (
                    <li className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <Link
                            href={`/collections/${categoryInfo?.slug}/${mainCategoryInfo?.mainSlug}/${subCategoryInfo?.subSlug}/${leafCategoryInfo.leafSlug}`}
                            className="hover:underline"
                        >
                            {leafCategoryInfo.name}
                        </Link>
                    </li>
                )}

                {/* Active Product Title */}
                <li className="flex items-center gap-1.5 min-w-0">
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="font-semibold text-gray-800 truncate" aria-current="page">
                        {title} {currentStorage} {currentColor ? `(${currentColor})` : ''}
                    </span>
                </li>
            </ol>
        </nav>
    );
};