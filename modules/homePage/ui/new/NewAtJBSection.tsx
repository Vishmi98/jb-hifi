'use client';

import { useState } from 'react';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ProductCard } from './ProductCard';
import { NewsCard } from './NewsCard';

import { NEW_PRODUCTS, NEWS_ITEMS, NEWS_TABS } from '@/constants/data';


const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 3, slidesToSlide: 1 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 3, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 2, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 1.2, slidesToSlide: 1 },
};

// Custom Bottom Navigation Controls matching segmented dots style
const CustomControls = ({
    next,
    previous,
    carouselState,
    totalSlides,
}: ButtonGroupProps & { totalSlides: number }) => {
    const currentSlide = carouselState?.currentSlide ?? 0;
    const normalizedSlide = ((currentSlide % totalSlides) + totalSlides) % totalSlides;

    return (
        <div className="flex items-center justify-center gap-2 mt-[14px]">
            <button
                type="button"
                onClick={() => previous && previous()}
                aria-label="Previous"
                className="border-none bg-transparent text-black cursor-pointer p-0 flex hover:opacity-75 transition-opacity"
            >
                <ChevronLeft size={23} strokeWidth={3} />
            </button>

            {Array.from({ length: totalSlides }).map((_, index) => (
                <span
                    key={index}
                    className={`w-6 h-[5px] rounded-[5px] block transition-all duration-200 ${index === normalizedSlide
                            ? 'bg-jb-yellow opacity-100'
                            : 'bg-white opacity-80'
                        }`}
                />
            ))}

            <button
                type="button"
                onClick={() => next && next()}
                aria-label="Next"
                className="border-none bg-transparent text-black cursor-pointer p-0 flex hover:opacity-75 transition-opacity"
            >
                <ChevronRight size={23} strokeWidth={3} />
            </button>
        </div>
    );
};

export default function NewAtJBSection() {
    const [activeNewsTab, setActiveNewsTab] = useState('Trending');

    return (
        <section className="w-full bg-jb-blue py-8 pb-10 box-border overflow-hidden select-none">
            <div className="w-[95%] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-center md:justify-between md:items-start mb-4.5">
                    <div className="jb-crazy_new text-6xl md:text-7xl font-black uppercase text-white">
                        NEW
                        <span className="text-3xl md:text-4xl ml-2">AT</span>
                        <span className="text-3xl md:text-4xl ml-2"> JB!</span>
                    </div>

                    <button
                        type="button"
                        className="bg-white border hidden md:block border-black text-black font-sans font-bold py-2.5 px-7 min-w-[138px] cursor-pointer hover:bg-neutral-100 transition-colors"
                    >
                        Explore New
                    </button>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-col md:flex-row gap-[34px] items-stretch">
                    {/* Left: Product Carousel */}
                    <div className="flex-1 min-w-0">
                        <div className="relative w-full">
                            <Carousel
                                responsive={responsive}
                                infinite={NEW_PRODUCTS.length > 3}
                                keyBoardControl={true}
                                arrows={false}
                                showDots={false}
                                renderButtonGroupOutside={true}
                                customButtonGroup={<CustomControls totalSlides={NEW_PRODUCTS.length} />}
                                draggable={true}
                                swipeable={true}
                                className="w-full py-0.5"
                                itemClass="px-1"
                            >
                                {NEW_PRODUCTS.map((product) => (
                                    <div key={product.id}>
                                        <ProductCard product={product} />
                                    </div>
                                ))}
                            </Carousel>
                        </div>
                    </div>

                    {/* Right: News Sidebar */}
                    <div className="w-full md:w-[360px] shrink-0 bg-[#0787cf] p-[15px_14px] box-border">
                        <h2 className="jb-callout-logo text-white text-xl md:text-2xl">
                            Latest News & Reviews
                        </h2>

                        {/* News Tabs */}
                        <div className="flex gap-0 overflow-x-auto border-b-2 border-white scrollbar-none mt-5">
                            {NEWS_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActiveNewsTab(tab)}
                                    className="relative border-none bg-transparent text-white font-sans font-bold whitespace-nowrap px-2.5 pb-[10px] cursor-pointer"
                                >
                                    {tab}

                                    {activeNewsTab === tab && (
                                        <span className="absolute left-0 right-0 -bottom-[2px] h-[5px] bg-jb-yellow" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* News Items */}
                        <div className="mt-[13px] flex flex-col gap-[7px]">
                            {NEWS_ITEMS.map((news) => (
                                <NewsCard key={news.id} news={news} />
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="flex justify-end mt-[13px]">
                            <button
                                type="button"
                                className="border-none bg-transparent text-white font-sans font-bold cursor-pointer p-0 inline-flex items-center hover:underline"
                            >
                                View News & Reviews
                                <ChevronRight size={16} className="ml-[3px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Action Button */}
                <button
                    type="button"
                    className="bg-white border block md:hidden border-black text-black font-sans font-bold py-2.5 px-7 w-full mt-5 cursor-pointer hover:bg-neutral-100 transition-colors"
                >
                    Explore New
                </button>
            </div>
        </section>
    );
}