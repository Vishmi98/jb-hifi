'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';

import { CategorySkeleton } from './CategorySkeleton';

import { slugify } from '@/utils/slug';
import { MainCategoryDataType } from '@/modules/mainCategory/mainCategory.types';
import { getMainCategoryByCategory } from '@/modules/mainCategory/mainCategory.service';
import { MainCategoryCard } from '@/modules/mainCategory/ui/MainCategoryCard';

interface MainCategoryCarouselProps {
    categoryId: number;
    parentSlug?: string; // Optional prop override
}

export default function MainCategoryCarousel({ categoryId, parentSlug }: MainCategoryCarouselProps) {
    const params = useParams();

    // Safely extract parameter or fallback to parentSlug / 'marketplace'
    const routeSlug = params?.slug || params?.category;
    const parentCategorySlug = parentSlug || (typeof routeSlug === 'string' ? routeSlug : 'marketplace');

    const [mainCategories, setMainCategories] = useState<MainCategoryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchMainCategories = async () => {
            if (!categoryId) return;

            setIsLoading(true);
            try {
                const response = await getMainCategoryByCategory({ categoryId });
                if (isMounted && response.success && response.mainCategories) {
                    setMainCategories(response.mainCategories);
                }
            } catch (error) {
                console.error("Failed to fetch main categories:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void fetchMainCategories();

        return () => {
            isMounted = false;
        };
    }, [categoryId]);

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
    }, [handleScroll, mainCategories]);

    const thumbWidthPercent = 30;
    const maxTranslatePercent = 100 - thumbWidthPercent;
    const thumbTransform = scrollProgress * (maxTranslatePercent / thumbWidthPercent) * 100;

    if (isLoading) {
        return (
            <div className="w-full my-6 flex justify-start items-center py-4">
                <CategorySkeleton count={8} />
            </div>
        );
    }

    if (!mainCategories.length) return null;

    return (
        <section className="w-full my-6 text-black flex flex-col items-center select-none">
            {/* Horizontal Scroll Track */}
            <div
                ref={scrollRef}
                className="w-full flex gap-4 md:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-2 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {mainCategories.map((cat) => {
                    const subcategorySlug = cat.mainSlug || slugify(cat.name);

                    const dynamicHref = `/collections/${parentCategorySlug}/${subcategorySlug}`;

                    return (
                        <div key={cat.id} className="snap-start shrink-0">
                            <MainCategoryCard category={cat} href={dynamicHref} />
                        </div>
                    );
                })}
            </div>

            {/* Scroll Controls */}
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