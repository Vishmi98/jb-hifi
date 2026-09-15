'use client';

import React from 'react';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { PromoCard } from './PromoCard';

import { PROMO_CARDS } from '@/constants/data';


// Responsive breakpoint config
const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5, slidesToSlide: 1 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1.2, slidesToSlide: 1 },
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

    // Normalize slide offset for infinite loop mode
    const normalizedSlide = ((currentSlide % totalSlides) + totalSlides) % totalSlides;

    // Calculate progress percentage (clamped between 0% and 100%)
    const progressPercent = Math.min(100, Math.max(0, (normalizedSlide / maxScroll) * 100));

    return (
        <div className="flex items-center justify-center gap-3 mt-6">
            {/* Previous Arrow Button */}
            <button
                type="button"
                onClick={() => previous && previous()}
                aria-label="Previous items"
                className="text-white hover:opacity-75 transition-opacity p-1 shrink-0"
            >
                <ChevronLeft size={28} strokeWidth={3} />
            </button>

            {/* Continuous Progress Bar Track */}
            <div className="relative w-48 sm:w-64 h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-[#C8FD00] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(15, progressPercent)}%` }}
                />
            </div>

            {/* Next Arrow Button */}
            <button
                type="button"
                onClick={() => next && next()}
                aria-label="Next items"
                className="text-white hover:opacity-75 transition-opacity p-1 shrink-0"
            >
                <ChevronRight size={28} strokeWidth={3} />
            </button>
        </div>
    );
};

export default function LatestTech() {
    return (
        <div className="w-full bg-jb-blue pt-10 pb-12 px-4 select-none overflow-hidden">
            <div className="w-[95%] mx-auto">
                {/* Header Title Section */}
                <div className="text-center mb-8">
                    <div className="jb-crazy_new text-6xl md:text-7xl font-black uppercase text-white">
                        NEW
                        <span className="text-3xl md:text-4xl ml-2">AT</span>
                        <span className="text-3xl md:text-4xl ml-2"> JB!</span>
                    </div>
                    <p className="jb-callout mt-2 text-3xl md:text-4xl font-extrabold uppercase text-white">
                        EXPLORE THE LATEST IN TECH AND ENTERTAINMENT!
                    </p>
                </div>

                {/* Carousel Section */}
                <div className="relative w-full">
                    <Carousel
                        responsive={responsive}
                        infinite={PROMO_CARDS.length > 4}
                        autoPlay={PROMO_CARDS.length > 4}
                        autoPlaySpeed={6000}
                        keyBoardControl={true}
                        arrows={false}
                        showDots={false}
                        renderButtonGroupOutside={true}
                        customButtonGroup={<CustomControls totalSlides={PROMO_CARDS.length} />}
                        draggable={true}
                        swipeable={true}
                        className="w-full py-2"
                        itemClass="pr-4"
                    >
                        {PROMO_CARDS.map((card) => (
                            <PromoCard key={card.id} {...card} />
                        ))}
                    </Carousel>
                </div>
            </div>
        </div>
    );
}