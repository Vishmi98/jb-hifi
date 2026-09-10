'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { slugify } from '@/utils/slug';
import { BrandDataType } from '@/modules/homePage/homePage.types';
import { getBrands } from '@/modules/homePage/homePage.service';

// Shimmer blur SVG placeholder generator
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

export default function BrandsPage() {
    const [brands, setBrands] = useState<BrandDataType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchAllBrands = async () => {
            try {
                setIsLoading(true);
                // Request a higher limit to fetch all active brands for A-Z grouping
                const res = await getBrands();

                if (isMounted && res.success) {
                    const activeBrands = (res.brands || []).filter(
                        (b) => b.isActive !== false
                    );
                    setBrands(activeBrands);
                }
            } catch (error) {
                console.error('Failed to fetch brands page data:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchAllBrands();

        return () => {
            isMounted = false;
        };
    }, []);

    // Filter top featured brands for logo grid (or fallback to first 15)
    const topBrands = brands.filter((b) => b.isFeatured).slice(0, 15);
    const featuredLogoList = topBrands.length > 0 ? topBrands : brands.slice(0, 15);

    // Group brands alphabetically (A to Z)
    const groupedBrands = brands.reduce<Record<string, BrandDataType[]>>((acc, brand) => {
        const firstLetter = (brand.name || '').charAt(0).toUpperCase();
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';

        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(brand);
        return acc;
    }, {});

    // Sort alphabetical keys
    const sortedAlphabetKeys = Object.keys(groupedBrands).sort();

    return (
        <div className="min-h-screen w-[95%] md:w-[90%] mx-auto text-black">
            {/* Breadcrumb Navigation */}
            <div className="my-10">
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-600">Shop by brand</span>
                </div>
            </div>

            {/* Page Header */}
            <header className="space-y-3 mb-10">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                    Shop by brand
                </h1>
                <p className="leading-relaxed text-lg">
                    At JB Hi-Fi you&apos;ll find the biggest and best brands in home entertainment and technology. Check out the range to find something that suits your needs, whether you&apos;re into the latest tech or looking for a great deal.
                </p>
            </header>

            {/* Section: Top Brands */}
            <section className="space-y-6">
                <h2 className="text-2xl md:text-3xl font-bold pb-2">
                    Top brands
                </h2>

                <div className="grid grid-cols-3 md:grid-cols-5 md:gap-6 items-center justify-items-center">
                    {isLoading ? (
                        /* Top Brands Skeletons */
                        Array.from({ length: 15 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="w-full h-24 bg-gray-100 rounded animate-pulse border border-gray-200"
                            />
                        ))
                    ) : (
                        /* Top Brands Logos */
                        featuredLogoList.map((brand, index) => {
                            const brandHref = `/brands/${brand.slug || slugify(brand.name)}`;
                            const logoSrc = brand.logo || '/placeholder-brand.png';
                            const isEager = index < 5;

                            return (
                                <Link
                                    key={brand.id || brand.id}
                                    href={brandHref}
                                    title={brand.name}
                                    className="relative w-full h-32 p-4 flex items-center justify-center hover:opacity-80 transition-opacity"
                                >
                                    <Image
                                        src={logoSrc}
                                        alt={`${brand.name} logo`}
                                        fill
                                        priority={isEager} // Next.js handles eager loading automatically when priority is true
                                        placeholder="blur"
                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(200, 100))}`}
                                        className="object-contain p-2"
                                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                                    />
                                </Link>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Section: All Featured Brands (A-Z Directory) */}
            <section className="space-y-6 pt-6">
                <h2 className="text-2xl md:text-3xl font-bold pb-2">
                    All featured brands
                </h2>

                {isLoading ? (
                    /* A-Z Skeleton Columns */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 animate-pulse">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-5 w-6 bg-gray-300 rounded font-bold" />
                                <div className="h-3 w-28 bg-gray-200 rounded" />
                                <div className="h-3 w-20 bg-gray-200 rounded" />
                                <div className="h-3 w-24 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* A-Z Columns Grid */
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-6 items-start text-xs sm:text-sm">
                        {sortedAlphabetKeys.map((letter) => (
                            <div key={letter} className="flex flex-col">
                                <span className="font-extrabold text-lg md:text-xl text-black pb-0.5 mb-1">
                                    {letter}
                                </span>
                                {groupedBrands[letter]
                                    .sort((a, b) => a.name.localeCompare(b.name))
                                    .map((brand) => {
                                        const brandHref = `/brands/${brand.slug || slugify(brand.name)}`;
                                        return (
                                            <Link
                                                key={brand.id || brand.id}
                                                href={brandHref}
                                                className="text-gray-800 hover:text-black underline transition-colors w-fit line-clamp-1 text-lg"
                                            >
                                                {brand.name}
                                            </Link>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer Disclaimer */}
            <footer className="pt-20 text-sm text-gray-500 leading-relaxed">
                ^Discounts apply to previous ticketed / advertised price prior to the discount offer. As we negotiate, products will likely have been sold below
                ticketed / advertised price prior to the discount offer. Prices may differ at airport stores.
            </footer>
        </div>
    );
}