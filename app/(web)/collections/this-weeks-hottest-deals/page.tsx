import Link from 'next/link'
import React from 'react'

import HeroCarousel from '@/modules/hottestDeals/ui/HeroCarousel'
import HottestDeals from '@/modules/hottestDeals/ui/HottestDeals'
import { COLLECTION_PRODUCTS } from '@/constants/data'
import ProductCard from '@/modules/homePage/ui/ProductCard'
import ProductFilters from '@/modules/hottestDeals/ui/ProductFilters'


const ThisWeeksHottestDealsPage = () => {
    return (
        <div className="min-h-screen w-[95%] md:w-[85%] mx-auto text-black">
            {/* Breadcrumb Navigation */}
            <div className="my-10">
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-600">This Week&apos;s Hottest Deals</span>
                </div>
            </div>

            <HeroCarousel />

            <HottestDeals />

            <section className="my-8">
                {/* Filters & Sorting Toolbar */}
                <ProductFilters />

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
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

export default ThisWeeksHottestDealsPage