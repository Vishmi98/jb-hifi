'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TRENDING_CARDS = [
    { id: 1, image: '/w1.webp', ctaHref: '#' },
    { id: 2, image: '/w2.webp', ctaHref: '#' },
    { id: 3, image: '/w3.webp', ctaHref: '#' },
    { id: 4, image: '/w4.webp', ctaHref: '#' },
    { id: 5, image: '/w5.webp', ctaHref: '#' },
    { id: 6, image: '/w6.webp', ctaHref: '#' },
];

export default function WhatsTrendingSection() {
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
            const scrollAmount = direction === 'left' ? -320 : 320;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full bg-white py-8 select-none">
            <div className="mx-auto w-[95%] md:w-[90%]">
                {/* Section Header */}
                <h2 className="sub-titles text-xl md:text-3xl">
                    WHAT&apos;S TRENDING
                </h2>

                {/* Scrollable Cards Grid */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-2 mt-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {TRENDING_CARDS.map((card) => (
                        <Link
                            key={card.id}
                            href={card.ctaHref}
                            className="shrink-0 w-[260px] sm:w-[250px] h-[450px] border-2 border-black overflow-hidden bg-black transition-transform hover:scale-[1.01]"
                        >
                            <img
                                src={card.image}
                                alt={`Trending banner ${card.id}`}
                                className="w-full h-full object-cover"
                            />
                        </Link>
                    ))}
                </div>

                {/* ================= BOTTOM SLIDER CONTROLS ================= */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        aria-label="Previous items"
                        className="text-black hover:opacity-75 transition-opacity p-1"
                    >
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>

                    {/* Continuous Progress Bar Track */}
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
                        <ChevronRight size={28} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </section>
    );
}