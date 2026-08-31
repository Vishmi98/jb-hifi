'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slugify } from '@/utils/slug';
import { useParams } from 'next/navigation';

interface CategoryItem {
    id: string;
    name: string;
    image: string;
    href?: string;
}

const CATEGORIES: CategoryItem[] = [
    { id: '1', name: 'Drones', image: '/c5.webp' },
    { id: '2', name: 'Cameras', image: '/c5.webp' },
    { id: '3', name: 'Mirrorless cameras', image: '/c5.webp' },
    { id: '4', name: 'Compact cameras', image: '/c5.webp' },
    { id: '5', name: 'Instant and film cameras', image: '/c5.webp' },
    { id: '6', name: 'Kids cameras', image: '/c5.webp' },
    { id: '7', name: 'Car cameras and dash cams', image: '/c5.webp' },
];

export default function CategoryCarousel() {
    const params = useParams();
    const parentCategory = params?.category as string;

    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrollable, setIsScrollable] = useState(false);

    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const totalScroll = scrollWidth - clientWidth;

        if (totalScroll > 0) {
            setIsScrollable(true);
            setScrollProgress(Math.min(Math.max(scrollLeft / totalScroll, 0), 1));
        } else {
            setIsScrollable(false);
            setScrollProgress(0);
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = direction === 'left' ? -280 : 280;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        handleScroll();
        el.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            el.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [handleScroll]);

    // Dynamic width calculation for indicator thumb (30% thumb width -> max left is 70%)
    const thumbWidthPercent = 30;
    const maxTranslatePercent = 100 - thumbWidthPercent;
    const thumbTransform = scrollProgress * (maxTranslatePercent / thumbWidthPercent) * 100;

    return (
        <section className="w-full my-6 text-black flex flex-col items-center select-none">
            {/* Horizontal Scroll Track */}
            <div
                ref={scrollRef}
                className="w-full flex gap-4 md:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-2 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {CATEGORIES.map((cat) => {
                    const subcategorySlug = slugify(cat.name);
                    const dynamicHref = cat.href
                        ? cat.href
                        : parentCategory
                            ? `/collections/${parentCategory}/${subcategorySlug}`
                            : `/collections/${subcategorySlug}`;

                    return (
                        <Link
                            key={cat.id}
                            href={dynamicHref}
                            className="flex flex-col items-center shrink-0 w-[90px] sm:w-[120px] group text-center py-2 snap-start"
                        >
                            <div className="relative md:w-[100px] md:h-[100px] w-[80px] h-[80px] rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden p-2 transition-transform duration-200 group-hover:scale-105">
                                <Image
                                    src={cat.image}
                                    alt={cat.name}
                                    fill
                                    className="object-contain p-2"
                                    sizes="(max-width: 768px) 80px, 100px"
                                />
                            </div>

                            <span className="mt-2 text-xs sm:text-sm font-medium text-black leading-tight max-w-[100px] sm:max-w-[120px] line-clamp-2">
                                {cat.name}
                            </span>
                        </Link>
                    );
                })}
            </div>

            {/* Scroll Controls (Hidden if list does not overflow) */}
            {isScrollable && (
                <div className="flex items-center justify-center gap-3 mt-3">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        aria-label="Previous categories"
                        className="text-black hover:opacity-70 transition-opacity p-1 active:scale-95"
                    >
                        <ChevronLeft size={24} strokeWidth={2.5} />
                    </button>

                    <div className="relative w-36 sm:w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-400 rounded-full transition-transform duration-75 ease-out"
                            style={{
                                width: `${thumbWidthPercent}%`,
                                transform: `translateX(${thumbTransform}%)`,
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        aria-label="Next categories"
                        className="text-black hover:opacity-70 transition-opacity p-1 active:scale-95"
                    >
                        <ChevronRight size={24} strokeWidth={2.5} />
                    </button>
                </div>
            )}
        </section>
    );
}