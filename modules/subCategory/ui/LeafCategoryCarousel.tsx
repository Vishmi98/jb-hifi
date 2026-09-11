'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useParams } from 'next/navigation';

import { slugify } from '@/utils/slug';
import { CategorySkeleton } from '@/modules/category/ui/CategorySkeleton';
import { LeafCategoryDataType } from '@/modules/leafCategory/leafCategory.types';
import { getLeafCategoryBySubCategory } from '@/modules/leafCategory/leafCategory.service';
import { LeafCategoryCard } from '@/modules/leafCategory/ui/LeafCategoryCard';


interface LeafCategoryCarouselProps {
    subCategoryId: number;
}

export default function LeafCategoryCarousel({ subCategoryId }: LeafCategoryCarouselProps) {
    const params = useParams();

    // Extract route parameters based on your file structure (e.g. /collections/[category]/[subCategory])
    const categorySlug = (params?.category || params?.slug) as string;
    const mainCategorySlug = (params?.subCategory || params?.mainCategory) as string;
    const subCategorySlug = (params?.leafCategory || params?.subCategorySlug) as string;

    const [leafCategories, setLeafCategories] = useState<LeafCategoryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchLeafCategories = async () => {
            if (!subCategoryId) return;

            setIsLoading(true);
            try {
                const response = await getLeafCategoryBySubCategory({ subCategoryId });
                if (isMounted && response.success && response.leafCategories) {
                    setLeafCategories(response.leafCategories);
                }
            } catch (error) {
                console.error("Failed to fetch leaf categories:", error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void fetchLeafCategories();

        return () => {
            isMounted = false;
        };
    }, [subCategoryId]);

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
    }, [handleScroll, leafCategories]);

    const thumbWidthPercent = 30;
    const maxTranslatePercent = 100 - thumbWidthPercent;
    const thumbTransform = scrollProgress * (maxTranslatePercent / thumbWidthPercent) * 100;

    if (isLoading) {
        return (
            <div className="w-full my-6 flex justify-center items-center py-4">
                <CategorySkeleton count={6} />
            </div>
        );
    }

    if (!leafCategories.length) return null;

    return (
        <section className="w-full my-6 text-black flex flex-col items-center select-none">
            {/* Horizontal Scroll Track */}
            <div
                ref={scrollRef}
                className="w-full flex gap-4 md:gap-8 overflow-x-auto scrollbar-none scroll-smooth pb-2 px-4 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {leafCategories.map((cat) => {
                    // Resolve slugs dynamically with fallback to relation data or slugify
                    const parentSlug = categorySlug || cat.categoryInfo?.slug;
                    const parentMainSlug = mainCategorySlug || cat.mainCategoryInfo?.mainSlug;
                    const parentSubSlug = subCategorySlug || cat.subCategoryInfo?.subSlug;
                    const subSlug = cat.leafSlug || slugify(cat.name);

                    // Form full route: /collections/[category]/[mainCategory]/[subCategory]
                    const dynamicHref = (parentSlug && parentMainSlug)
                        ? `/collections/${parentSlug}/${parentMainSlug}/${parentSubSlug}/${subSlug}`
                        : `/collections/${subSlug}`;

                    return (
                        <div key={cat.id} className="snap-start shrink-0">
                            <LeafCategoryCard category={cat} href={dynamicHref} />
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