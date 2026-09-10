import React from 'react'
import Link from 'next/link';
import Image from 'next/image';

import { BrandDetailsProps } from '../brand.types';
import HeroCarousel from './HeroCarousel';

const BrandOverview = ({ brand }: BrandDetailsProps) => {
    const {
        id,
        name,
        slug,
        bannerImages,
        collections
    } = brand;

    const hasBannerImages = Boolean(bannerImages && bannerImages.length > 0);

    return (
        <div className="min-h-screen text-black">
            {/* Render HeroCarousel only if bannerImages exist and are non-empty */}
            {hasBannerImages && <HeroCarousel bannerImages={bannerImages} />}

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 w-[95%] md:w-[90%] mx-auto">
                {collections && collections.length > 0 ? (
                    collections.map((item) => {
                        // Extract category identifiers (prefer slug, fallback to ID or 'all')
                        const categorySlug = item.categoryInfo?.slug;
                        const mainCategorySlug = item.mainCategoryInfo?.mainSlug;
                        const subCategorySlug = item.subCategoryInfo?.subSlug;

                        // Construct dynamic route
                        const subCollectionHref = `/collections/${categorySlug}/${mainCategorySlug}/${subCategorySlug}`;
                        const mainCollectionHref = `/collections/${categorySlug}/${mainCategorySlug}`;

                        // Determine display name for fallback image alt or title
                        const displayName =
                            item.subCategoryInfo?.name ||
                            item.mainCategoryInfo?.name ||
                            item.categoryInfo?.name ||
                            'Collection Item';

                        return (
                            <div key={item._id} className="flex flex-col items-center">
                                {/* Image Box Link */}
                                <Link
                                    href={item.subCategoryId ? subCollectionHref : mainCollectionHref}
                                    className="relative w-full h-[200px] overflow-hidden bg-white hover:border-gray-400 transition"
                                >
                                    <Image
                                        src={item.imagePath ? item.imagePath : ""}
                                        alt={displayName}
                                        fill
                                        className="object-contain"
                                    />
                                </Link>

                                {/* Compare Link below card */}
                                {item.compareLink && (
                                    <Link
                                        href={item.compareLink}
                                        className="mt-3 text-sm font-medium text-black underline hover:text-gray-700"
                                    >
                                        Compare {item.subCategoryInfo?.name ? item.subCategoryInfo?.name : item.mainCategoryInfo?.name}
                                    </Link>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No collections available for {name}.
                    </div>
                )}
            </div>
        </div>
    )
}

export default BrandOverview;