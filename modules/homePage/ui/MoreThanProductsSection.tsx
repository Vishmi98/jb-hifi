'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { SERVICES } from '@/constants/data';


export default function MoreThanProductsSection() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeProgress, setActiveProgress] = useState(0);

    // Calculate scroll progress percentage
    const updateProgress = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const maxScrollLeft = container.scrollWidth - container.clientWidth;
        if (maxScrollLeft <= 0) {
            setActiveProgress(100);
            return;
        }

        const currentScroll = container.scrollLeft;
        const progress = (currentScroll / maxScrollLeft) * 100;
        setActiveProgress(Math.min(100, Math.max(0, progress)));
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        updateProgress();
        container.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);

        return () => {
            container.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, [updateProgress]);

    // Scroll controls
    const handleScroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollAmount = 300;
        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <section className="w-full bg-black text-white py-10 px-6 overflow-hidden">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

                {/* Left Heading */}
                <div className="max-w-[320px] shrink-0 text-center md:text-left">
                    <h2 className="yellow-title">
                        AT JB, WE&apos;RE MORE THAN JUST PRODUCTS
                    </h2>
                </div>

                {/* Right Services List & Controls */}
                <div className="flex-1 w-full flex flex-col items-center gap-6 min-w-0">

                    {/* Icons Grid / Row */}
                    <div
                        ref={scrollContainerRef}
                        className="w-full flex items-center justify-start gap-5 md:gap-10 overflow-x-auto scrollbar-none py-2 scroll-smooth"
                    >
                        {SERVICES.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <a
                                    key={`${service.id}-${index}`}
                                    href={`#${service.id}`}
                                    className="flex flex-col items-center justify-start text-center w-[110px] shrink-0 group cursor-pointer"
                                >
                                    {/* Icon */}
                                    <div className="w-12 h-12 flex items-center justify-center mb-3 text-white transition-transform duration-200 group-hover:scale-110">
                                        <Icon
                                            size={38}
                                            strokeWidth={1.5}
                                        />
                                    </div>

                                    {/* Title */}
                                    <span className="text-white font-bold leading-tight w-full h-[36px] flex items-start justify-center">
                                        {service.title}
                                    </span>
                                </a>
                            );
                        })}
                    </div>

                    {/* Carousel Slider Controls */}
                    <div className="flex items-center justify-center gap-3 w-full max-w-[380px] mt-2">
                        <button
                            type="button"
                            onClick={() => handleScroll('left')}
                            aria-label="Previous"
                            className="text-white hover:text-[#fff000] cursor-pointer transition-colors p-1"
                        >
                            <ChevronLeft size={22} strokeWidth={3} />
                        </button>

                        {/* Scroll Indicator Track */}
                        <div className="flex-1 h-[4px] bg-neutral-600 rounded-full overflow-hidden relative">
                            <div
                                className="h-full bg-[#fff000] transition-all duration-150 ease-out"
                                style={{ width: `${activeProgress}%` }}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => handleScroll('right')}
                            aria-label="Next"
                            className="text-white hover:text-[#fff000] cursor-pointer transition-colors p-1"
                        >
                            <ChevronRight size={22} strokeWidth={3} />
                        </button>
                    </div>

                </div>

            </div>
        </section>
    );
}