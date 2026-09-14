'use client';

import { useState } from 'react';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProductCard from './ProductCard';

import { RECOMMENDATIONS } from '@/constants/data';


const RECOMMENDATION_TABS = ["We Think You'll Like", 'Recently Viewed'];

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
                <ChevronLeft size={24} strokeWidth={3} />
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
                <ChevronRight size={24} strokeWidth={3} />
            </button>
        </div>
    );
};

export default function JustForYouSection() {
    const [activeTab, setActiveTab] = useState("We Think You'll Like");

    return (
        <section className="w-full bg-white py-8 select-none">
            <div className="mx-auto w-[95%]">
                {/* Section Heading */}
                <h2 className="jb-callout-logo text-2xl md:text-4xl mb-4">
                    JUST FOR YOU
                </h2>

                {/* Tab Navigation */}
                <div className="border-b-2 border-black flex gap-10 pb-2 my-4">
                    {RECOMMENDATION_TABS.map((tab) => (
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

                {/* Product Carousel */}
                <div className="relative w-full">
                    <Carousel
                        responsive={responsive}
                        infinite={RECOMMENDATIONS.length > 4}
                        keyBoardControl={true}
                        arrows={false}
                        showDots={false}
                        renderButtonGroupOutside={true}
                        customButtonGroup={<CustomControls totalSlides={RECOMMENDATIONS.length} />}
                        draggable={true}
                        swipeable={true}
                        className="w-full py-2"
                        itemClass="pr-2"
                    >
                        {RECOMMENDATIONS.map((item) => (
                            <div key={item.id}>
                                <ProductCard prod={item} />
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}