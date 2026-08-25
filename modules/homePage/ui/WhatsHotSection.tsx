'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Heart, Star, ShoppingBag } from 'lucide-react';

const HOT_TABS = [
    'Hottest Deals',
    '40% Off Deals',
    'New at JB - Google Pixel 11 Series',
    'Computers',
    'TVs & Soundbars',
    'Mobile Phones',
    'Home Appliances',
    'Refurbished Tech',
];

const PRODUCTS = [
    {
        id: 1,
        title: 'Apple iPhone 17 Pro Max 256GB (Silver)',
        image: '/wh1.webp',
        badge: 'TRADE IN YOUR OLD PHONE',
        badgeType: 'outline-red',
        rating: 4.7,
        reviews: 43,
        price: 1899,
        priceTagLabel: 'RED HOT DEAL',
    },
    {
        id: 2,
        title: 'Apple iPhone 17 Pro 256GB (Cosmic Orange)',
        image: '/wh2.webp',
        badge: 'TRADE IN YOUR OLD PHONE',
        badgeType: 'outline-red',
        rating: 4.3,
        reviews: 24,
        price: 1799,
        priceTagLabel: 'RED HOT DEAL',
    },
    {
        id: 3,
        brand: 'HP',
        title: 'HP Laptop 15-fd0943tu 15.6" Full HD Laptop (Intel N150) [128GB]',
        image: '/wh3.webp',
        badge: 'BUNDLE BUY',
        badgeType: 'purple',
        rating: 4.0,
        reviews: 2,
        price: 379,
        priceTagLabel: 'RED HOT DEAL',
    },
    {
        id: 4,
        brand: 'LG',
        title: 'LG 65" OLED EVO AI C6 4K Smart TV [2026]',
        image: '/wh4.webp',
        badge: 'ON SALE',
        secondaryBadge: 'BUNDLE BUY',
        badgeType: 'solid-red',
        rating: 5.0,
        reviews: 4,
        price: 3277,
        originalPrice: 3995,
        savings: '$718 OFF^',
        tagline: 'FREE DELIVERY',
    },
    {
        id: 5,
        brand: 'DREAM',
        title: 'Dream Aqua Roller AE Robot |Vacuum Cleaner',
        image: '/wh5.webp',
        badge: 'ON SALE',
        badgeType: 'solid-red',
        rating: 3.5,
        reviews: 330,
        price: 899,
        originalPrice: 2399,
        savings: '$1500 OFF^',
    },
    {
        id: 6,
        brand: 'DELL',
        title: 'Dell XPS 13 13.4" 2.5K Touch Laptop (Intel Core 5 - 320) [512GB/8GB]',
        image: '/wh6.webp',
        badge: 'ON SALE',
        secondaryBadge: 'BUNDLE BUY',
        badgeType: 'solid-red',
        rating: 0,
        reviews: 0,
        price: 1199,
        originalPrice: 1399,
        savings: '$200 OFF^',
    },
];

export default function WhatsHotSection() {
    const [activeTab, setActiveTab] = useState('Hottest Deals');
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
        <section className="w-full bg-white py-8 select-none">
            <div className="mx-auto w-[95%] md:w-[90%]">
                {/* Header */}
                <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight mb-6 uppercase">
                    WHAT'S HOT
                </h2>

                {/* Tab Navigation Bar */}
                <div className="border-b-2 border-black flex overflow-x-auto scrollbar-none gap-10 pb-2 mb-4">
                    {HOT_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap font-bold text-sm sm:text-base pb-2 relative transition-colors ${activeTab === tab ? 'text-black' : 'text-zinc-600 hover:text-black'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-[-8px] z-20 left-0 right-0 h-[5px] bg-[#ffec0f]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Top Right "View all" Link */}
                <div className="flex justify-end mb-4">
                    <Link
                        href="#"
                        className="flex items-center gap-1 font-extrabold text-sm text-black hover:underline"
                    >
                        View all <ChevronRight size={18} strokeWidth={3} />
                    </Link>
                </div>

                {/* Product Carousel */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {PRODUCTS.map((prod) => (
                        <div
                            key={prod.id}
                            className="shrink-0 w-[220px] sm:w-[250px] border border-gray-200 bg-white flex flex-col justify-between p-3 relative group hover:border-black transition-all"
                        >
                            {/* Top Badges & Favorite Heart */}
                            <div className="flex justify-between items-start mb-2 relative z-10 min-h-[40px]">
                                <div className="flex flex-col gap-1 items-start">
                                    {/* Badge 1 */}
                                    {prod.badgeType === 'outline-red' && (
                                        <span className="border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-red-600 font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider bg-white">
                                            {prod.badge}
                                        </span>
                                    )}
                                    {prod.badgeType === 'solid-red' && (
                                        <span className="bg-red-600 text-white font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {prod.badge}
                                        </span>
                                    )}
                                    {prod.badgeType === 'purple' && (
                                        <span className="bg-purple-900 text-[#ffec0f] font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {prod.badge}
                                        </span>
                                    )}

                                    {/* Secondary Badge */}
                                    {prod.secondaryBadge && (
                                        <span className="bg-purple-900 text-[#ffec0f] font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            {prod.secondaryBadge}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    aria-label="Add to Wishlist"
                                    className="text-gray-400 hover:text-black transition-colors"
                                >
                                    <Heart size={20} />
                                </button>
                            </div>

                            {/* Product Image */}
                            <div className="w-full h-[180px] flex items-center justify-center">
                                <img
                                    src={prod.image}
                                    alt={prod.title}
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                                />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-end">
                                {prod.brand && (
                                    <span className="text-xs font-black text-black uppercase tracking-tight">
                                        {prod.brand}
                                    </span>
                                )}
                                <h3 className="text-xs sm:text-sm font-bold text-black leading-tight line-clamp-2 min-h-[32px] mb-1">
                                    {prod.title}
                                </h3>

                                {/* Ratings */}
                                {(prod.rating > 0 && prod.reviews > 0) && <div className="flex items-center gap-1 mb-3">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                fill={i < Math.floor(prod.rating) ? 'currentColor' : 'none'}
                                                className={i < Math.floor(prod.rating) ? 'text-yellow-400' : 'text-gray-300'}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-gray-500 font-semibold">
                                        {prod.rating} ({prod.reviews})
                                    </span>
                                </div>}

                                {/* JB Price Tag Widget */}
                                <div className="m-5 flex flex-col items-center">
                                    <div className="bg-[#ffec0f] border-1 border-black pt-1.5 w-full text-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        {/* Crossed Out Original Price Ticket */}
                                        {prod.originalPrice && (
                                            <div className="absolute right-8 md:right-14 bg-red-600 text-white font-black text-[10px] px-1.5 uppercase inline-block -mt-3 mb-0.5 transform line-through">
                                                TICKET ${prod.originalPrice}
                                            </div>
                                        )}

                                        {/* RED HOT DEAL Label Header */}
                                        {prod.priceTagLabel && (
                                            <div className="absolute right-8 md:right-14 bg-red-600 text-white font-black text-[10px] px-1.5 uppercase inline-block -mt-3 mb-0.5 transform">
                                                {prod.priceTagLabel}
                                            </div>
                                        )}

                                        {/* Main Price */}
                                        <div className="whats-font font-black text-red-600 leading-none flex items-center justify-center">
                                            $
                                            <span className='text-xl sm:text-2xl'>
                                                {prod.price}
                                            </span>
                                        </div>

                                        {/* Savings Subtext */}
                                        {prod.savings && (
                                            <div className="bg-red-600 text-white font-black text-sm uppercase py-1.5 px-1 mt-1 border border-black italic">
                                                {prod.savings}
                                            </div>
                                        )}

                                        {/* Optional Tagline (e.g., FREE DELIVERY) */}
                                        {prod.tagline && (
                                            <div className="absolute bottom-[-10] right-8 md:right-13 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white  text-black font-black text-[10px] px-1.5 uppercase inline-block -mt-3 mb-0.5 transform">
                                                {prod.tagline}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    type="button"
                                    className="w-full bg-[#008a00] hover:bg-[#007300] text-white font-bold text-xs py-2.5 rounded-none uppercase transition-colors"
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ================= BOTTOM SLIDER CONTROLS ================= */}
                <div className="flex items-center justify-center gap-3 mt-4">
                    <button
                        type="button"
                        onClick={() => scroll('left')}
                        aria-label="Previous items"
                        className="text-black hover:opacity-75 transition-opacity p-1"
                    >
                        <ChevronLeft size={28} strokeWidth={3} />
                    </button>

                    {/* Continuous Progress Bar Track */}
                    <div className="relative w-48 sm:w-64 h-1.5 bg-gray-300 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-[#ffec0f] transition-all duration-150"
                            style={{
                                width: '35%',
                                transform: `translateX(${scrollProgress * 1.85}%)`,
                            }}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => scroll('right')}
                        aria-label="Next items"
                        className="text-black hover:opacity-75 transition-opacity p-1"
                    >
                        <ChevronRight size={28} strokeWidth={3} />
                    </button>
                </div>

                {/* Center Bottom View All Action Button */}
                <div className="flex justify-center mt-6">
                    <Link
                        href="#"
                        className="bg-black hover:bg-zinc-800 text-white font-extrabold text-sm px-8 py-3 flex items-center gap-2 uppercase transition-colors"
                    >
                        <ShoppingBag size={18} /> View all
                    </Link>
                </div>
            </div>
        </section>
    );
}