import React from 'react'

import { FEATURED_PRODUCTS } from '@/constants/data'
import ProductCard from '@/modules/homePage/ui/ProductCard'


const HottestDeals = () => {
    return (
        <>
            <div className="mt-8 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    This Weeks Hottest Deals

                </h1>
                <p className="text-gray-700 text-sm sm:text-base max-w-4xl leading-relaxed">
                    Get extra value at JB with our big range of weekly deals. Our weekly tech deals include top prices on a range of different products from mobiles to laptops! And because we’re JB, you know our weekly deals include big brands, which means top technology, quality products, and reliability.
                </p>
            </div>

            {/* Featured Products Section */}
            <section className="my-12">
                <h2 className="jb-callout-logo text-xl md:text-2xl font-bold mb-3">
                    Featured
                </h2>

                {/* Flex container with explicit items-stretch for uniform height */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                    {FEATURED_PRODUCTS.map((prod) => (
                        <div key={prod.id} className="w-full flex justify-center">
                            <ProductCard
                                key={prod.id}
                                prod={prod}
                            />
                        </div>
                    ))}
                </div>

            </section>
        </>
    )
}

export default HottestDeals