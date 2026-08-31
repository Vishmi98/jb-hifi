'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

import ProductCard from './ProductCard';

import { TVS_PRODUCTS } from '@/constants/data';


export default function TvsSmashed() {
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
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full bg-white py-8 select-none">
            <div className="mx-auto w-[95%] md:w-[90%]">
                {/* Header */}
                <h2 className="sub-titles text-xl md:text-3xl">
                    TVs Smashed!
                </h2>

                {/* Top Right "View all" Link */}
                <div className="flex justify-end my-4">
                    <Link
                        href="#"
                        className="flex items-center gap-1 font-extrabold text-sm text-black hover:underline"
                    >
                        View all <ChevronRight size={18} strokeWidth={3} />
                    </Link>
                </div>

                {/* Product Carousel */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {TVS_PRODUCTS.map((prod) => (
                        <ProductCard
                            key={prod.id}
                            prod={prod}
                        />
                    ))}
                </div>

                {/* ================= BOTTOM SLIDER CONTROLS ================= */}
                <div className="flex items-center justify-center gap-3 mt-4">
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

                {/* Center Bottom View All Action Button */}
                <div className="flex justify-center mt-6">
                    <Link
                        href="#"
                        className="bg-black hover:bg-zinc-800 text-white font-extrabold text-sm px-8 py-3 flex items-center gap-2 uppercase transition-colors"
                    >
                        <ShoppingBag size={18} /> View all
                    </Link>
                </div>
            </div>
        </section>
    );
}