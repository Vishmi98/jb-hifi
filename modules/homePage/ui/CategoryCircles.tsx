'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { CIRCLE_CATEGORIES } from '@/constants/data';
import { slugify } from '@/utils/slug';

// Helper function to turn category names into URL-safe slugs

export default function CategoryCircles() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        setScrollProgress((scrollLeft / totalScroll) * 100);
      }
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full relative select-none overflow-hidden">
      <div className="bg-jb-yellow h-20 w-full absolute top-0 left-0 z-0" />

      <div className="relative z-10 mx-auto w-[95%] md:w-[90%] pt-4 pb-6">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-14 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CIRCLE_CATEGORIES.map((cat) => {
            // Generates /collections/movies-and-tv-shows, /collections/gaming, etc.
            const dynamicHref = `/collections/${slugify(cat.name)}`;

            return (
              <Link
                key={cat.id}
                href={dynamicHref}
                className="flex flex-col items-center shrink-0 w-[110px] sm:w-[120px] group text-center py-2"
              >
                <div className="relative md:w-[100px] md:h-[100px] w-[85px] h-[85px] rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden p-2 transition-transform duration-200 group-hover:scale-105">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 85px, 100px"
                  />
                </div>

                <span className="mt-3 text-xs sm:text-base font-medium text-black leading-tight max-w-[120px] line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="text-black hover:opacity-70 transition-opacity p-1"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>

          <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-jb-yellow transition-all duration-150"
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
            className="text-black hover:opacity-70 transition-opacity p-1"
          >
            <ChevronRight size={28} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}