'use client';

import Link from 'next/link';
import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';


const TRENDING_CARDS = [
  { id: 1, image: '/w1.webp', ctaHref: '#' },
  { id: 2, image: '/w2.webp', ctaHref: '#' },
  { id: 3, image: '/w3.webp', ctaHref: '#' },
  { id: 4, image: '/w4.webp', ctaHref: '#' },
  { id: 5, image: '/w5.webp', ctaHref: '#' },
  { id: 6, image: '/w6.webp', ctaHref: '#' },
];

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 5, slidesToSlide: 1 },
  desktop: { breakpoint: { max: 1536, min: 1024 }, items: 4, slidesToSlide: 1 },
  tablet: { breakpoint: { max: 1024, min: 640 }, items: 3, slidesToSlide: 1 },
  mobile: { breakpoint: { max: 640, min: 0 }, items: 1.5, slidesToSlide: 1 },
};

// Custom Bottom Navigation Controls with continuous progress indicator
const CustomControls = ({ next, previous, carouselState, totalSlides }: ButtonGroupProps & { totalSlides: number }) => {
  const currentSlide = carouselState?.currentSlide ?? 0;
  const slidesToShow = carouselState?.slidesToShow || 1;

  // Calculate maximum index scroll range
  const maxScroll = Math.max(1, totalSlides - slidesToShow);

  // Normalize slide offset for infinite loop mode
  const normalizedSlide = ((currentSlide % totalSlides) + totalSlides) % totalSlides;

  // Calculate progress percentage (clamped between 0% and 100%)
  const progressPercent = Math.min(100, Math.max(0, (normalizedSlide / maxScroll) * 100));

  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      {/* Previous Arrow Button */}
      <button
        type="button"
        onClick={() => previous && previous()}
        aria-label="Previous items"
        className="text-black hover:opacity-75 transition-opacity p-1 shrink-0"
      >
        <ChevronLeft size={28} strokeWidth={3} />
      </button>

      {/* Continuous Progress Bar Track */}
      <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-jb-yellow rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(15, progressPercent)}%` }}
        />
      </div>

      {/* Next Arrow Button */}
      <button
        type="button"
        onClick={() => next && next()}
        aria-label="Next items"
        className="text-black hover:opacity-75 transition-opacity p-1 shrink-0"
      >
        <ChevronRight size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

export default function WhatsTrendingSection() {
  return (
    <section className="w-full bg-white py-8 select-none">
      <div className="mx-auto w-[95%]">
        {/* Section Header */}
        <h2 className="jb-callout-logo text-2xl md:text-4xl mb-4">
          WHAT&apos;S TRENDING
        </h2>

        {/* Carousel Slider */}
        <div className="relative w-full">
          <Carousel
            responsive={responsive}
            infinite={TRENDING_CARDS.length > 4}
            keyBoardControl={true}
            arrows={false}
            showDots={false}
            renderButtonGroupOutside={true}
            customButtonGroup={<CustomControls totalSlides={TRENDING_CARDS.length} />}
            draggable={true}
            swipeable={true}
            className="w-full py-2"
            itemClass="pr-4"
          >
            {TRENDING_CARDS.map((card) => (
              <Link
                key={card.id}
                href={card.ctaHref}
                className="block w-full h-[400px] md:h-[450px] border-2 border-black overflow-hidden bg-black transition-transform hover:scale-[1.01]"
              >
                <img
                  src={card.image}
                  alt={`Trending banner ${card.id}`}
                  className="w-full h-full object-cover"
                />
              </Link>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}