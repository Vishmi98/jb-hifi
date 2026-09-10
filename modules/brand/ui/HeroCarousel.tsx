'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { HERO_SLIDES } from '@/constants/data';


interface HeroCarouselProps {
  bannerImages?: string[];
}

export default function HeroCarousel({ bannerImages }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Use brand banner images if available and non-empty; fallback to static HERO_SLIDES
  const hasBanners = Boolean(bannerImages && bannerImages.length > 0);

  const slides = hasBanners
    ? bannerImages!.map((imgUrl, index) => ({
      id: `banner-${index}`,
      image: imgUrl,
      title: `Banner ${index + 1}`,
    }))
    : HERO_SLIDES.map((slide) => ({
      id: String(slide.id),
      image: slide.image,
      title: slide.title || 'Slide Image',
    }));

  const totalSlides = slides.length;

  useEffect(() => {
    if (totalSlides <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 6000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const nextSlide = () => {
    if (totalSlides <= 1) return;
    setCurrent((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides <= 1) return;
    setCurrent((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  if (totalSlides === 0) return null;

  return (
    <div className='bg-gray-100 py-5'>
      <div className="w-[95%] md:w-[90%] mx-auto">
        {/* Main Banner Container */}
        <div className="relative w-full aspect-[16/9] md:aspect-[21/7] overflow-hidden bg-black select-none border-1 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide) => (
              <div key={slide.id} className="min-w-full h-full relative">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 90vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="text-black hover:opacity-75 transition-opacity p-1"
            >
              <ChevronLeft size={28} strokeWidth={3} />
            </button>

            {/* Indicator Bars */}
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${current === index
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
              className="text-black hover:opacity-75 transition-opacity p-1"
            >
              <ChevronRight size={28} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}