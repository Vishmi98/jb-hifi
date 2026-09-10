'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { HOTTEST_DEALS_HERO_SLIDES } from '@/constants/data';


export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HOTTEST_DEALS_HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % HOTTEST_DEALS_HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + HOTTEST_DEALS_HERO_SLIDES.length) % HOTTEST_DEALS_HERO_SLIDES.length);
  };

  return (
    <>
      {/* Outer wrapper to contain carousel and yellow bottom navigation bar */}
      <div className="w-full">
        {/* Main Banner Box */}
        <div className="relative w-full h-auto overflow-hidden bg-black select-none border-2 border-black">
          {/* Slides Container */}
          <div
            className="flex w-full h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {HOTTEST_DEALS_HERO_SLIDES.map((slide) => (
              <div
                key={slide.id}
                className={`min-w-full h-full flex flex-col md:flex-row relative ${slide.bgColor} ${slide.textColor}`}
              >
                {/* Slide Background Image & Overlay */}
                <div className="relative w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM CONTROL BAR ================= */}
        <div className="flex items-center justify-center gap-3 pt-3">
          {/* Previous Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="text-black hover:opacity-75 transition-opacity p-1"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>

          {/* Dash Indicators */}
          <div className="flex items-center gap-2">
            {HOTTEST_DEALS_HERO_SLIDES.map((_, index) => (
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

          {/* Next Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="text-black hover:opacity-75 transition-opacity p-1"
          >
            <ChevronRight size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </>
  );
}