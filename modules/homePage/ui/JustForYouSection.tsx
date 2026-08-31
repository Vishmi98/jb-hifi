'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react'

import ProductCard from './ProductCard';

import { RECOMMENDATIONS } from '@/constants/data';


const RECOMMENDATION_TABS = ['We Think You\'ll Like', 'Recently Viewed'];

export default function JustForYouSection() {
    const [activeTab, setActiveTab] = useState('We Think You\'ll Like');
    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const totalScroll = scrollWidth - clientWidth;
            if (totalScroll > 0) {
                setScrollProgress((scrollLeft / totalScroll) * 100);
            }
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full bg-white py-8 select-none">
            <div className="mx-auto w-[95%] md:w-[90%]">

                {/* Section Heading */}
                <h2 className="sub-titles text-xl md:text-3xl">
                    JUST FOR YOU
                </h2>

                {/* Tab Navigation */}
                <div className="border-b-2 border-black flex gap-10 pb-2 my-4">
                    {RECOMMENDATION_TABS.map((tab) => (
                        <button
                            key={tab}
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

                {/* Product Cards Grid Carousel */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-3 overflow-x-auto scrollbar-none scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {RECOMMENDATIONS.map((item) => (
                        <ProductCard
                            key={item.id}
                            prod={item}
                        />
                    ))}
                </div>

                {/* Carousel Scroll Bar Controls */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        aria-label="Previous items"
                        className="text-black hover:opacity-75 transition-opacity p-1"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>

                    <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-jb-yellow transition-all duration-150"
                            style={{
                                width: '35%',
                                transform: `translateX(${scrollProgress * 1.85}%)`,
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        aria-label="Next items"
                        className="text-black hover:opacity-75 transition-opacity p-1"
                    >
                        <ChevronRight size={24} strokeWidth={3} />
                    </button>
                </div>

            </div>
        </section>
    );
}