'use client';

import { useState, useEffect } from 'react';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { CategoryCard } from './CategoryCard';
import { CategorySkeleton } from './CategorySkeleton';
import { CategoryDataType } from '../category.types';
import { getCategories } from '../category.service';


const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 8, slidesToSlide: 1 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 6, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 3, slidesToSlide: 1 },
};

// Custom Bottom Navigation Controls (Single line progress bar indicator)
const CustomControls = ({ next, previous, carouselState, totalSlides }: ButtonGroupProps & { totalSlides: number }) => {
    const currentSlide = carouselState?.currentSlide ?? 0;
    const slidesToShow = carouselState?.slidesToShow || 1;

    // Calculate maximum index scroll range
    const maxScroll = Math.max(1, totalSlides - slidesToShow);

    // Normalize slide offset for infinite mode loops
    const normalizedSlide = ((currentSlide % totalSlides) + totalSlides) % totalSlides;

    // Calculate progress percentage (clamped between 0% and 100%)
    const progressPercent = Math.min(100, Math.max(0, (normalizedSlide / maxScroll) * 100));

    return (
        <div className="flex items-center justify-center gap-3 pt-3 absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-full max-w-[280px] sm:max-w-md px-4">
            {/* Previous Arrow Button */}
            <button
                type="button"
                onClick={() => previous && previous()}
                className="p-1 text-black hover:opacity-75 transition-opacity shrink-0"
                aria-label="Previous Categories"
            >
                <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Continuous Progress Bar Indicator Line */}
            <div className="relative w-full h-1.5 sm:h-2 bg-black/20 rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-[#ffec0f] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(15, progressPercent)}%` }}
                />
            </div>

            {/* Next Arrow Button */}
            <button
                type="button"
                onClick={() => next && next()}
                className="p-1 text-black hover:opacity-75 transition-opacity shrink-0"
                aria-label="Next Categories"
            >
                <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default function CategoryCircles() {
    const [categories, setCategories] = useState<CategoryDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch data from API service
    useEffect(() => {
        let isMounted = true;

        const fetchCategoriesData = async () => {
            setIsLoading(true);
            try {
                const response = await getCategories();
                if (isMounted && response.success) {
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

    return (
        <div className="w-full relative select-none overflow-hidden">
            {/* Yellow top half background container */}
            <div className="bg-[#ffec0f] h-20 w-full absolute top-0 left-0 z-0" />

            {/* Main slider container */}
            <div className="relative z-10 mx-auto w-[95%] md:w-[90%] pt-4 pb-16 md:pb-20">
                {isLoading ? (
                    <CategorySkeleton count={6} />
                ) : categories.length === 0 ? (
                    <div className="text-center py-6 text-gray-500 font-medium">
                        No categories available.
                    </div>
                ) : (
                    <div className="relative w-full">
                        <Carousel
                            responsive={responsive}
                            infinite={categories.length > 4}
                            keyBoardControl={true}
                            arrows={false}
                            showDots={false}
                            renderButtonGroupOutside={true}
                            customButtonGroup={<CustomControls totalSlides={categories.length} />}
                            draggable={true}
                            swipeable={true}
                            className="w-full py-2"
                        >
                            {categories.map((category) => (
                                <div key={category.id}>
                                    <CategoryCard category={category} />
                                </div>
                            ))}
                        </Carousel>
                    </div>
                )}
            </div>
        </div>
    );
}