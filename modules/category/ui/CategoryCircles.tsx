'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CategoryCard } from './CategoryCard';
import { CategorySkeleton } from './CategorySkeleton';
import { CategoryDataType } from '../category.types';
import { getCategories } from '../category.service';


export default function CategoryCircles() {
    const [categories, setCategories] = useState<CategoryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scrollProgress, setScrollProgress] = useState<number>(0);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch data from API service
    useEffect(() => {
        let isMounted = true;

        const fetchCategoriesData = async () => {
            setIsLoading(true);
            try {
                const response = await getCategories();
                if (isMounted && response.success) {
                    // Filter out inactive categories if needed
                    const activeCategories = response.categories.filter((cat) => cat.isActive);
                    setCategories(activeCategories);
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchCategoriesData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Handle horizontal scroll progress calculation
    const handleScroll = useCallback(() => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            const totalScroll = scrollWidth - clientWidth;
            if (totalScroll > 0) {
                setScrollProgress((scrollLeft / totalScroll) * 100);
            }
        }
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -300 : 300;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full relative select-none overflow-hidden">
            {/* Yellow top half background container */}
            <div className="bg-[#ffec0f] h-20 w-full absolute top-0 left-0 z-0" />

            {/* Main slider container */}
            <div className="relative z-10 mx-auto w-[95%] md:w-[90%] pt-4 pb-6">
                {isLoading ? (
                    <CategorySkeleton count={8} />
                ) : categories.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 font-medium">
                        No categories available.
                    </div>
                ) : (
                    <>
                        {/* Scrollable Circle Items */}
                        <div
                            ref={scrollRef}
                            onScroll={handleScroll}
                            className="flex gap-3 md:gap-14 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-2"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {categories.map((category) => (
                                <CategoryCard key={category.id} category={category} />
                            ))}
                        </div>

                        {/* Bottom Slider Controls */}
                        <div className="flex items-center justify-center gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => scroll('left')}
                                aria-label="Previous categories"
                                className="text-black hover:opacity-70 transition-opacity p-1 cursor-pointer"
                            >
                                <ChevronLeft size={28} strokeWidth={3} />
                            </button>

                            {/* Progress Bar */}
                            <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-[#ffec0f] transition-all duration-150"
                                    style={{
                                        width: '40%',
                                        transform: `translateX(${scrollProgress * 1.5}%)`,
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => scroll('right')}
                                aria-label="Next categories"
                                className="text-black hover:opacity-70 transition-opacity p-1 cursor-pointer"
                            >
                                <ChevronRight size={28} strokeWidth={3} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}