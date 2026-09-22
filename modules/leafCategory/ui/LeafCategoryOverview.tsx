import React from 'react'
import Link from 'next/link';

import { LeafCategoryDetailsProps } from '../leafCategory.types';

import HeroCarousel from '@/modules/collections/ui/HeroCarousel';
import { COLLECTION_PRODUCTS, FEATURED_PRODUCTS } from '@/constants/data';
import ProductCard from '@/modules/homePage/ui/ProductCard';
import ProductFilters from '@/modules/collections/ui/ProductFilters';
import FeaturedProductsSection from './FeaturedProductsSection';


const LeafCategoryOverview = ({ leafCategory }: LeafCategoryDetailsProps) => {
    const {
        id,
        name,
        leafSlug,
        imagePath,
        description,
        categoryInfo,
        mainCategoryInfo,
        subCategoryInfo
    } = leafCategory;

    return (
        <div className="min-h-screen w-[95%] md:w-[90%] mx-auto text-black">
            {/* Breadcrumb Navigation */}
            <div className="my-10">
                <div className="text-sm text-gray-600 flex items-center gap-1.5 flex-wrap">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <Link href={`/collections/${categoryInfo?.slug}`}>{categoryInfo?.name}</Link>
                    <span>/</span>
                    <Link href={`/collections/${categoryInfo?.slug}/${mainCategoryInfo?.mainSlug}`}>{mainCategoryInfo?.name}</Link>
                    <span>/</span>
                    <Link href={`/collections/${categoryInfo?.slug}/${mainCategoryInfo?.mainSlug}/${subCategoryInfo?.subSlug}`}>{subCategoryInfo?.name}</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-600">{name}</span>
                </div>
            </div>

            <HeroCarousel />

            {/* Header Description */}
            <div className="mt-8 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    {name}
                </h1>
                <p className="text-gray-700 text-sm sm:text-base max-w-4xl leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Featured Products Section */}
            <FeaturedProductsSection leafCategoryId={id} />

            <section className="my-8">
                {/* Filters & Sorting Toolbar */}
                <ProductFilters />

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 justify-items-center">
                    {COLLECTION_PRODUCTS.map((product) => (
                        <div key={product.id} className="w-full flex justify-center">
                            <ProductCard prod={product} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default LeafCategoryOverview