'use client';

import { useState } from 'react';
import Link from 'next/link';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

import ProductCard from './ProductCard';

import { HOT_TABS, PRODUCTS } from '@/constants/data';
import { CategoryDataType } from '@/modules/category/category.types';


const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5, slidesToSlide: 1 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2.5, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1.5, slidesToSlide: 1 },
};

// Custom Bottom Navigation Controls
const CustomControls = ({
    next,
    previous,
    carouselState,
    totalSlides,
}: ButtonGroupProps & { totalSlides: number }) => {
    const currentSlide = carouselState?.currentSlide ?? 0;
    const slidesToShow = carouselState?.slidesToShow || 1;

    // Calculate maximum index scroll range
    const maxScroll = Math.max(1, totalSlides - slidesToShow);

    // Normalize slide offset for infinite mode loops
    const normalizedSlide = ((currentSlide % totalSlides) + totalSlides) % totalSlides;

    // Calculate progress percentage (clamped between 0% and 100%)
    const progressPercent = Math.min(100, Math.max(0, (normalizedSlide / maxScroll) * 100));

    return (
        <div className="flex items-center justify-center gap-3 mt-4">
            {/* Previous Arrow Button */}
            <button
                type="button"
                onClick={() => previous && previous()}
                aria-label="Previous items"
                className="text-black hover:opacity-75 transition-opacity p-1 shrink-0"
            >
                <ChevronLeft size={28} strokeWidth={3} />
            </button>

            {/* Continuous Progress Bar Indicator Line */}
            <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-jb-yellow rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(15, progressPercent)}%` }}
                />
            </div>

            {/* Next Arrow Button */}
            <button
                type="button"
                onClick={() => next && next()}
                aria-label="Next items"
                className="text-black hover:opacity-75 transition-opacity p-1 shrink-0"
            >
                <ChevronRight size={28} strokeWidth={3} />
            </button>
        </div>
    );
};

interface WhatsHotSectionProps {
    category?: CategoryDataType;
}

export default function WhatsHotSection({ category }: WhatsHotSectionProps) {
    const [activeTab, setActiveTab] = useState('Hottest Deals');

    const categorySlug = category?.slug ?? 'this-weeks-hottest-deals';

    return (
        <section className="w-full bg-white py-8 select-none">
            <div className="mx-auto w-[95%]">
                {/* Header */}
                <h2 className="jb-callout-logo text-2xl md:text-4xl mb-4">
                    WHAT&apos;S HOT
                </h2>

                {/* Tab Navigation Bar */}
                <div className="border-b-2 border-black flex overflow-x-auto scrollbar-none gap-10 pb-2 my-4">
                    {HOT_TABS.map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap font-bold text-sm sm:text-base pb-2 relative transition-colors ${activeTab === tab ? 'text-black' : 'text-zinc-600 hover:text-black'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-8px] z-20 left-0 right-0 h-[5px] bg-jb-yellow" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Top Right "View all" Link */}
                <div className="flex justify-end mb-4">
                    <Link
                        href={`/collections/${categorySlug}`}
                        className="flex items-center gap-1 font-extrabold text-sm text-black hover:underline"
                    >
                        View all <ChevronRight size={18} strokeWidth={3} />
                    </Link>
                </div>

                {/* Product Carousel */}
                <div className="relative w-full">
                    <Carousel
                        responsive={responsive}
                        infinite={PRODUCTS.length > 4}
                        keyBoardControl={true}
                        arrows={false}
                        showDots={false}
                        renderButtonGroupOutside={true}
                        customButtonGroup={<CustomControls totalSlides={PRODUCTS.length} />}
                        draggable={true}
                        swipeable={true}
                        className="w-full py-2"
                        itemClass="pr-2"
                    >
                        {PRODUCTS.map((prod) => (
                            <div key={prod.id}>
                                <ProductCard prod={prod} />
                            </div>
                        ))}
                    </Carousel>
                </div>

                {/* Center Bottom View All Action Button */}
                <div className="flex justify-center mt-6">
                    <Link
                        href={`/collections/${categorySlug}`}
                        className="bg-black hover:bg-zinc-800 text-white font-extrabold text-sm px-8 py-3 flex items-center gap-2 uppercase transition-colors"
                    >
                        <ShoppingBag size={18} /> View all
                    </Link>
                </div>
            </div>
        </section>
    );
}