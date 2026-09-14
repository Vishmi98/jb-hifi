'use client';

import Carousel, { ButtonGroupProps } from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { SERVICES } from '@/constants/data';

const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1536 }, items: 6, slidesToSlide: 1 },
    desktop: { breakpoint: { max: 1536, min: 1024 }, items: 5, slidesToSlide: 1 },
    tablet: { breakpoint: { max: 1024, min: 640 }, items: 4, slidesToSlide: 1 },
    mobile: { breakpoint: { max: 640, min: 0 }, items: 4, slidesToSlide: 1 },
};

// Custom Bottom Navigation Controls
const CustomControls = ({
    next,
    previous,
    carouselState,
    totalSlides,
}: ButtonGroupProps & { totalSlides: number }) => {
    const currentSlide = carouselState?.currentSlide ?? 0;
    const slidesToShow = carouselState?.slidesToShow || 1;

    // Calculate maximum index scroll range
    const maxScroll = Math.max(1, totalSlides - slidesToShow);

    // Normalize slide offset for infinite mode loops
    const normalizedSlide = ((currentSlide % totalSlides) + totalSlides) % totalSlides;

    // Calculate progress percentage (clamped between 0% and 100%)
    const progressPercent = Math.min(100, Math.max(0, (normalizedSlide / maxScroll) * 100));

    return (
        <div className="flex items-center justify-center gap-3 w-full max-w-[380px] mx-auto mt-2">
            <button
                type="button"
                onClick={() => previous && previous()}
                aria-label="Previous"
                className="text-white hover:text-[#fff000] cursor-pointer transition-colors p-1 shrink-0"
            >
                <ChevronLeft size={22} strokeWidth={3} />
            </button>

            {/* Continuous Scroll Indicator Track */}
            <div className="flex-1 h-[4px] bg-neutral-600 rounded-full overflow-hidden relative">
                <div
                    className="h-full bg-[#fff000] rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(15, progressPercent)}%` }}
                />
            </div>

            <button
                type="button"
                onClick={() => next && next()}
                aria-label="Next"
                className="text-white hover:text-[#fff000] cursor-pointer transition-colors p-1 shrink-0"
            >
                <ChevronRight size={22} strokeWidth={3} />
            </button>
        </div>
    );
};

export default function MoreThanProductsSection() {
    return (
        <section className="w-full bg-black text-white py-10 overflow-hidden select-none">
            <div className="w-[95%] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Left Heading */}
                <div className="max-w-[320px] shrink-0 text-center md:text-left">
                    <h2 className="jb-callout-yellow text-2xl md:text-3xl">
                        AT JB, WE&apos;RE MORE THAN JUST PRODUCTS
                    </h2>
                </div>

                {/* Right Services Carousel & Controls */}
                <div className="flex-1 w-full flex flex-col items-center gap-6 min-w-0">
                    <div className="relative w-full">
                        <Carousel
                            responsive={responsive}
                            infinite={SERVICES.length > 4}
                            keyBoardControl={true}
                            arrows={false}
                            showDots={false}
                            renderButtonGroupOutside={true}
                            customButtonGroup={<CustomControls totalSlides={SERVICES.length} />}
                            draggable={true}
                            swipeable={true}
                            className="w-full py-2"
                            itemClass="px-2"
                        >
                            {SERVICES.map((service, index) => {
                                const Icon = service.icon;
                                return (
                                    <a
                                        key={`${service.id}-${index}`}
                                        href={`#${service.id}`}
                                        className="flex flex-col items-center justify-start text-center w-full group cursor-pointer"
                                    >
                                        {/* Icon */}
                                        <div className="w-12 h-12 flex items-center justify-center mb-3 text-white transition-transform duration-200 group-hover:scale-110">
                                            <Icon size={38} strokeWidth={1.5} />
                                        </div>

                                        {/* Title */}
                                        <span className="text-white font-bold leading-tight w-full h-[36px] flex items-start justify-center">
                                            {service.title}
                                        </span>
                                    </a>
                                );
                            })}
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}