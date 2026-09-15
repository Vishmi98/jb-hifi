'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { HeroCarouselProps } from '../category.types';

import { BannerItemDataType } from '@/modules/bannerCollection/bannerCollection.types';
import { getBannerByType } from '@/modules/bannerCollection/bannerCollection.service';
import { subscribeToDataChanges } from '@/lib/realtimeClient';


export default function HeroCarousel({
  bannerType = "category",
  categoryId,
  mainCategoryId,
  subCategoryId,
  leafCategoryId,
  brandId,
  productId,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<BannerItemDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isInitial = true;

    const fetchBanner = async () => {
      try {
        if (isInitial) setIsLoading(true);
        const response = await getBannerByType({
          bannerType,
          categoryId,
          mainCategoryId,
          subCategoryId,
          leafCategoryId,
          brandId,
          productId,
        });

        // If response is successful and contains items, set slides
        if (response?.success && response.data?.items?.length) {
          setSlides(response.data.items);
        } else {
          // Quietly fallback to empty list when banner is not found
          setSlides([]);
        }
      } catch (error) {
        setSlides([]);
      } finally {
        if (isInitial) {
          setIsLoading(false);
          isInitial = false;
        }
      }
    };

    void fetchBanner();

    const unsubscribe = subscribeToDataChanges('bannerItems', () => {
      void fetchBanner();
    });

    return () => {
      unsubscribe();
    };
  }, [bannerType, categoryId, mainCategoryId, subCategoryId, leafCategoryId, brandId, productId]);

  // Auto-slide effect
  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // Helper function to resolve dynamic navigation link for each slide item
  const getSlideLink = (slide: BannerItemDataType): string | null => {
    if (slide.productId) {
      return `/products/${slide.productId}`;
    }

    const categorySlug = slide.categoryInfo?.slug;
    const mainSlug = slide.mainCategoryInfo?.mainSlug;
    const subSlug = slide.subCategoryInfo?.subSlug;
    const leafSlug = slide.leafCategoryInfo?.leafSlug;

    if (categorySlug) {
      if (slide.leafCategoryId && mainSlug && subSlug && leafSlug) {
        return `/collections/${categorySlug}/${mainSlug}/${subSlug}/${leafSlug}`;
      }

      if (slide.subCategoryId && mainSlug && subSlug) {
        return `/collections/${categorySlug}/${mainSlug}/${subSlug}`;
      }

      if (slide.mainCategoryId && mainSlug) {
        return `/collections/${categorySlug}/${mainSlug}`;
      }

      return `/collections/${categorySlug}`;
    }

    if (slide.brandId) {
      return `/brands/${slide.brandId}`;
    }

    return null;
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Render Skeleton Loader while loading
  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] bg-gray-300 dark:bg-gray-800 border-2 border-transparent" />
        <div className="flex items-center justify-center gap-3 pt-3">
          <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-800" />
          <div className="flex items-center gap-2">
            <div className="w-12 h-1.5 rounded-full bg-gray-300 dark:bg-gray-800" />
            <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="w-12 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  // Hide component completely if no slides match criteria
  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Main Banner Box */}
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] overflow-hidden bg-black select-none border-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-black">
        <div
          className="flex w-full h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, index) => {
            const link = getSlideLink(slide);
            const content = (
              <div className="relative w-full h-full flex-shrink-0 min-w-full">
                {slide.imagePath ? (
                  <Image
                    src={slide.imagePath}
                    alt={`Banner slide ${slide.id}`}
                    fill
                    priority={index === 0}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
              </div>
            );

            return (
              <div key={slide.id} className="min-w-full h-full flex-shrink-0">
                {link ? (
                  <Link href={link} className="block w-full h-full">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation Controls */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="text-black hover:opacity-75 transition-opacity p-1 cursor-pointer"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${current === index
                  ? 'w-12 bg-black'
                  : 'w-12 bg-black/20 hover:bg-black/40'
                  }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="text-black hover:opacity-75 transition-opacity p-1 cursor-pointer"
          >
            <ChevronRight size={28} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
}