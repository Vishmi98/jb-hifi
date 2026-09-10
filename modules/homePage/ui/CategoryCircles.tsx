'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CIRCLE_CATEGORIES = [
  { id: 1, name: 'Movies & TV Shows', image: '/c1.webp', href: '#' },
  { id: 2, name: 'Music & Vinyl', image: '/c2.webp', href: '#' },
  { id: 3, name: 'Collectibles & Merchandise', image: '/c3.webp', href: '#' },
  { id: 4, name: 'Outdoors & Travel', image: '/c4.webp', href: '#' },
  { id: 5, name: 'Cameras & Drones', image: '/c5.webp', href: '#' },
  { id: 6, name: 'Content Creator Gear', image: '/c6.webp', href: '#' },
  { id: 7, name: 'Office Supplies', image: '/c7.webp', href: '#' },
  { id: 8, name: 'Online-only Range', image: '/c8.webp', href: '#' },
  { id: 9, name: 'Gaming', image: '/c9.webp', href: '#' },
  { id: 10, name: 'Home Security', image: '/c10.webp', href: '#' }
];

export default function CategoryCircles() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle horizontal scrolling and calculate exact progress percentage
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
      {/* Yellow top half background container */}
      <div className="bg-[#ffec0f] h-20 w-full absolute top-0 left-0 z-0" />

      {/* Main slider container positioned over the background boundary */}
      <div className="relative z-10 mx-auto w-[95%] md:w-[90%] pt-4 pb-6">
        {/* Scrollable Circle Items */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-14 overflow-x-auto scrollbar-none scroll-smooth pb-4 px-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CIRCLE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center shrink-0 w-[110px] sm:w-[120px] group text-center py-2"
            >
              {/* White Circular Badge Frame */}
              <div className="md:w-[100px] md:h-[100px] w-[85px] h-[85px] rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden p-2 transition-transform duration-200 group-hover:scale-105">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title Label */}
              <span className="mt-3 text-xs sm:text-base font-medium text-black leading-tight max-w-[120px] line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>

        {/* ================= BOTTOM SLIDER CONTROLS ================= */}
        <div className="flex items-center justify-center gap-3 mt-4">
          {/* Previous Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="text-black hover:opacity-70 transition-opacity p-1"
          >
            <ChevronLeft size={28} strokeWidth={3} />
          </button>

          {/* Continuous Track Progress Bar */}
          <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-[#ffec0f] transition-all duration-150"
              style={{
                width: '40%', // Width of current indicator handle
                transform: `translateX(${scrollProgress * 1.5}%)`,
              }}
            />
          </div>

          {/* Next Arrow */}
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