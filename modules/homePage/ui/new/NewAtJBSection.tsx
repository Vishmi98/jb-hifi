'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { ProductCard } from './ProductCard';
import { NewsCard } from './NewsCard';

import { NEW_PRODUCTS, NEWS_ITEMS, NEWS_TABS } from '@/constants/data';


export default function NewAtJBSection() {
    const productsRef = useRef<HTMLDivElement>(null);

    const [activeNewsTab, setActiveNewsTab] = useState('Trending');
    const [activeSlide, setActiveSlide] = useState(0);

    const scrollProducts = (direction: 'left' | 'right') => {
        if (!productsRef.current) return;

        const amount = 210;

        productsRef.current.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });

        if (direction === 'right') {
            setActiveSlide((prev) =>
                Math.min(prev + 1, NEW_PRODUCTS.length - 1)
            );
        } else {
            setActiveSlide((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <section className="w-full bg-jb-blue py-8 pb-10 box-border overflow-hidden">
            <div className="w-[92%] max-w-[1280px] mx-auto">
                {/* Header */}
                <div className="flex items-center justify-center md:justify-between md:items-start mb-4.5">
                    <div className="font-[family-name:var(--font-jb-display),Impact,sans-serif] text-[52px] font-black leading-[0.9] tracking-[-0.04em] uppercase text-white [-webkit-text-stroke:2px_#000000] [text-shadow:4px_4px_0_#000000] -rotate-2 pl-1">
                        NEW
                        <span className="text-[30px] ml-2">AT JB!</span>
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
                        <div
                            ref={productsRef}
                            className="flex gap-[9px] overflow-x-auto scroll-smooth scrollbar-none pb-0.5"
                        >
                            {NEW_PRODUCTS.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-2 mt-[14px]">
                            <button
                                type="button"
                                onClick={() => scrollProducts('left')}
                                aria-label="Previous"
                                className="border-none bg-transparent text-black cursor-pointer p-0 flex"
                            >
                                <ChevronLeft size={23} strokeWidth={3} />
                            </button>

                            {NEW_PRODUCTS.map((_, index) => (
                                <span
                                    key={index}
                                    className={`w-6 h-[5px] rounded-[5px] block transition-opacity ${index === activeSlide
                                        ? 'bg-jb-yellow opacity-100'
                                        : 'bg-white opacity-80'
                                        }`}
                                />
                            ))}

                            <button
                                type="button"
                                onClick={() => scrollProducts('right')}
                                aria-label="Next"
                                className="border-none bg-transparent text-black cursor-pointer p-0 flex"
                            >
                                <ChevronRight size={23} strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Right: News Sidebar */}
                    <div className="w-fullshrink-0 bg-[#0787cf] p-[15px_14px] box-border">
                        <h2 className="news">
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