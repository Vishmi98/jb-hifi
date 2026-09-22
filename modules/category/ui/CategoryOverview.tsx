import React from 'react'
import Link from 'next/link';

import HeroCarousel from './HeroCarousel';
import MainCategoryCarousel from './MainCategoryCarousel';
import FeaturedProductsSection from './FeaturedProductsSection';
import { CategoryDetailsProps } from '../category.types';

import { COLLECTION_PRODUCTS } from '@/constants/data';
import ProductCard from '@/modules/homePage/ui/ProductCard';
import ProductFilters from '@/modules/collections/ui/ProductFilters';


const CategoryOverview = ({ category }: CategoryDetailsProps) => {
    const {
        id,
        name,
        slug,
        imagePath,
        description
    } = category;

    return (
        <div className="min-h-screen w-[95%] md:w-[90%] mx-auto text-black">
            {/* Breadcrumb Navigation */}
            <div className="my-10">
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-600">{name}</span>
                </div>
            </div>

            <HeroCarousel bannerType="category" categoryId={id} />

            {/* Header Description */}
            <div className="mt-8 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    {name}
                </h1>
                <p className="text-gray-700 text-sm sm:text-base max-w-4xl leading-relaxed">
                    {description}
                </p>
            </div>

            <MainCategoryCarousel categoryId={id} />

            {/* Featured Products Section */}
            <FeaturedProductsSection categoryId={id} />

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

export default CategoryOverview