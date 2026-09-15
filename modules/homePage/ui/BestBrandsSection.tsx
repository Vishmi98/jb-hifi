'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { slugify } from '@/utils/slug';
import { subscribeToDataChanges } from '@/lib/realtimeClient';
import { BrandDataType } from '@/modules/brand/brand.types';
import { getBrands } from '@/modules/brand/brand.service';

// Helper function to resolve dynamic brand URL based on single page availability and category metadata
// Helper function to resolve dynamic brand URL based on single page availability and category metadata
export const getBrandHref = (brand: BrandDataType): string => {
    // 1. Standard Brand Single Page route if enabled
    if (brand.haveSinglePage === true) {
        return `/brands/${brand.slug || slugify(brand.name)}`;
    }

    // 2. Redirects for brands WITHOUT a single page (haveSinglePage === false)
    if (brand.haveSinglePage === false) {
        if (
            brand.categoryId &&
            brand.mainCategoryId &&
            brand.subCategoryId &&
            brand.leafCategoryId &&
            brand.categoryInfo?.slug &&
            brand.mainCategoryInfo?.mainSlug &&
            brand.subCategoryInfo?.subSlug &&
            brand.leafCategoryInfo?.leafSlug
        ) {
            return `/collections/${brand.categoryInfo.slug}/${brand.mainCategoryInfo.mainSlug}/${brand.subCategoryInfo.subSlug}/${brand.leafCategoryInfo.leafSlug}`;
        }

        if (
            brand.categoryId &&
            brand.mainCategoryId &&
            brand.subCategoryId &&
            brand.categoryInfo?.slug &&
            brand.mainCategoryInfo?.mainSlug &&
            brand.subCategoryInfo?.subSlug
        ) {
            return `/collections/${brand.categoryInfo.slug}/${brand.mainCategoryInfo.mainSlug}/${brand.subCategoryInfo.subSlug}`;
        }

        if (
            brand.categoryId &&
            brand.mainCategoryId &&
            brand.categoryInfo?.slug &&
            brand.mainCategoryInfo?.mainSlug
        ) {
            return `/collections/${brand.categoryInfo.slug}/${brand.mainCategoryInfo.mainSlug}`;
        }

        if (brand.categoryId && brand.categoryInfo?.slug) {
            return `/collections/${brand.categoryInfo.slug}`;
        }
    }

    // 3. Fallback default route
    return `/brands/${brand.slug || slugify(brand.name)}`;
};

// Shimmer SVG generator for smooth image loading
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str);

export default function BestBrandsSection() {
    const [brands, setBrands] = useState<BrandDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBrands = useCallback(async (showLoading = false) => {
        if (showLoading) {
            setIsLoading(true);
        }

        try {
            const res = await getBrands();

            if (res.success && res.brands) {
                const activeBrands = res.brands.filter(
                    (brand) => brand.isActive !== false
                );
                setBrands(activeBrands);
            }
        } catch (error) {
            console.error('Failed to fetch brands:', error);
        } finally {
            if (showLoading) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const initialFetchId = window.setTimeout(() => {
            void fetchBrands(true);
        }, 0);

        const unsubscribe = subscribeToDataChanges('brands', () => {
            void fetchBrands();
        });

        return () => {
            window.clearTimeout(initialFetchId);
            unsubscribe();
        };
    }, [fetchBrands]);

    return (
        <section className="w-full bg-white py-8">
            <div className="mx-auto w-[95%]">
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="jb-callout-logo text-2xl md:text-4xl mb-4">
                        ALL THE BEST BRANDS
                    </h2>

                    <Link
                        href="/brands"
                        className="hidden md:flex items-center gap-1 text-black text-[13px] sm:text-[14px] font-bold hover:underline transition-all"
                    >
                        View all brands
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </Link>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center justify-items-center">
                    {isLoading ? (
                        /* Skeleton Loading State */
                        Array.from({ length: 15 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-full h-[100px] sm:h-[150px] bg-gray-100 rounded-lg animate-pulse border border-gray-200"
                            />
                        ))
                    ) : (
                        /* Brands Render */
                        brands.slice(0, 15).map((brand, index) => {
                            const brandHref = getBrandHref(brand);
                            const logoSrc = brand.logo || '/placeholder-brand.png';
                            const isEager = index < 5; // Load top 5 eager, rest lazy

                            return (
                                <Link
                                    key={brand.id}
                                    href={brandHref}
                                    className="relative w-full h-[100px] sm:h-[150px] p-4 flex items-center justify-center rounded-lg border border-transparent hover:border-gray-200 hover:shadow-sm transition-all group"
                                    title={brand.name}
                                >
                                    <Image
                                        src={logoSrc}
                                        alt={`${brand.name} logo`}
                                        fill
                                        loading={isEager ? 'eager' : 'lazy'}
                                        priority={isEager}
                                        placeholder="blur"
                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(200, 100))}`}
                                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-200"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                    />
                                </Link>
                            );
                        })
                    )}
                </div>

                {/* Mobile View All Link */}
                <Link
                    href="/brands"
                    className="flex md:hidden items-center justify-end mt-4 gap-1 text-black font-bold hover:underline transition-all text-sm"
                >
                    View all brands
                    <ChevronRight size={16} strokeWidth={2.5} />
                </Link>
            </div>
        </section>
    );
}