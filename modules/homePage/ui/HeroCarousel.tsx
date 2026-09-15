'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import { BannerItemDataType } from '@/modules/bannerCollection/bannerCollection.types';
import { getBannerByType } from '@/modules/bannerCollection/bannerCollection.service';
import { subscribeToDataChanges } from '@/lib/realtimeClient';


const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 1, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 1, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1, slidesToSlide: 1 },
};

// Custom Bottom Navigation Bar Component
const CustomControls = ({ next, previous, carouselState, totalSlides }: ButtonGroupProps & { totalSlides: number }) => {
  const currentSlide = carouselState?.currentSlide ?? 0;

  // Calculate active index accounting for cloned slides in infinite mode
  const activeIndex = (currentSlide - (carouselState?.slidesToShow || 1) + totalSlides) % totalSlides;

  return (
    <div className="flex items-center justify-center gap-4 pt-3 absolute bottom-[-30px] left-1/2 -translate-x-1/2">
      {/* Previous Arrow Button */}
      <button
        type="button"
        onClick={() => previous && previous()}
        className="p-1 text-black hover:opacity-75 transition-opacity"
        aria-label="Previous Slide"
      >
        <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Horizontal Bar Indicators */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${index === activeIndex ? 'w-12 bg-black' : 'w-12 bg-black/20'
              }`}
          />
        ))}
      </div>

      {/* Next Arrow Button */}
      <button
        type="button"
        onClick={() => next && next()}
        className="p-1 text-black hover:opacity-75 transition-opacity"
        aria-label="Next Slide"
      >
        <svg className="w-5 h-5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<BannerItemDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isInitial = true;

    const fetchBanners = async () => {
      try {
        if (isInitial) setIsLoading(true);
        const res = await getBannerByType({ bannerType: 'home' });

        if (res.success && res.data?.items && Array.isArray(res.data.items)) {
          setSlides(res.data.items);
        } else {
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

    void fetchBanners();

    const unsubscribe = subscribeToDataChanges('bannerItems', () => {
      void fetchBanners();
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

  // ================= SKELETON LOADER =================
  if (isLoading) {
    return (
      <div className="bg-jb-yellow py-4">
        <div className="w-full md:w-[90%] mx-auto">
          <div className="relative w-full h-[200px] md:h-[385px] bg-black/10 animate-pulse border-2 border-black overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-black/5 via-black/20 to-black/5" />
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 bg-jb-yellow">
            <div className="w-7 h-7 bg-black/10 rounded-full animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-12 h-2.5 bg-black/30 rounded-full animate-pulse" />
              <div className="w-12 h-2.5 bg-black/10 rounded-full animate-pulse" />
              <div className="w-12 h-2.5 bg-black/10 rounded-full animate-pulse" />
              <div className="w-12 h-2.5 bg-black/10 rounded-full animate-pulse" />
            </div>
            <div className="w-7 h-7 bg-black/10 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="bg-jb-yellow py-5">
      <div className="w-full md:w-[90%] mx-auto pb-10 md:pb-18">
        <div className="relative w-full bg-jb-yellow relative">
          {/* Main Frame */}
          <div className="shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-black border border-black">
            <Carousel
              responsive={responsive}
              infinite={slides.length > 1}
              autoPlay={slides.length > 1}
              autoPlaySpeed={6000}
              keyBoardControl={true}
              arrows={false}
              showDots={false}
              renderButtonGroupOutside={true}
              customButtonGroup={<CustomControls totalSlides={slides.length} />}
              draggable={true}
              swipeable={true}
              className="w-full h-auto"
            >
              {slides.map((slide, index) => {
                const imageUrl = slide.imagePath || '';
                const linkUrl = getSlideLink(slide);

                const content = (
                  <div className="relative w-full h-[200px] md:h-[385px]">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={slide.productInfo?.name || `Banner ${index + 1}`}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                    )}
                  </div>
                );

                return (
                  <div
                    key={slide.id || index}
                    className="w-full relative bg-black text-white"
                  >
                    {linkUrl ? (
                      <Link href={linkUrl} className="w-full block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
}