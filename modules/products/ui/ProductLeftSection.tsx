'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import { ChevronRight, Heart, MessageSquare, Phone, Star } from 'lucide-react';
import Link from 'next/link';

import { ProductLeftSectionProps } from '../products.types';


export const ProductLeftSection: React.FC<ProductLeftSectionProps> = ({
    product,
    selectedImage,
    setSelectedImage,
    currentColor,
    selectedVariant,
    currentStorage,
    uniqueColorVariants,
    handleColorSelect,
    handleStorageSelect,
    uniqueStorageVariants
}) => {
    const { title, tagLineInfo, sellTypeInfo, ratings, reviews, variants, mainImage, images = [] } = product;

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const isScrollingRef = useRef(false);

    // 1. Prioritize variant image as index 0, deduplicating rest of images array
    const variantImage = selectedVariant?.imagePath || selectedImage;
    const galleryImages = useMemo(() => {
        if (!variantImage) return images;
        return [variantImage, ...images.filter((img) => img !== variantImage)];
    }, [variantImage, images]);

    // 2. Derive active index directly from galleryImages list
    const activeIndex = galleryImages.indexOf(selectedImage);
    const currentIndex = activeIndex !== -1 ? activeIndex : 0;

    // 3. Handle swipe/scroll on mobile
    const handleScroll = () => {
        if (!scrollContainerRef.current || isScrollingRef.current) return;

        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        if (clientWidth === 0) return;

        const newIndex = Math.round(scrollLeft / clientWidth);
        if (
            newIndex >= 0 &&
            newIndex < galleryImages.length &&
            galleryImages[newIndex] !== selectedImage
        ) {
            setSelectedImage(galleryImages[newIndex]);
        }
    };

    // 4. Synchronize scroll position when variant or selectedImage updates
    useEffect(() => {
        if (scrollContainerRef.current && currentIndex >= 0) {
            const container = scrollContainerRef.current;
            isScrollingRef.current = true;

            container.scrollTo({
                left: currentIndex * container.clientWidth,
                behavior: 'smooth'
            });

            const timeout = setTimeout(() => {
                isScrollingRef.current = false;
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [currentIndex, selectedImage]);

    return (
        <div className="flex flex-col md:gap-2 lg:col-span-7 mt-2 md:mt-0">
            <div className="w-auto">
                {sellTypeInfo?.name && (
                    <span
                        className={`inline-block md:hidden text-sm px-1.5 py-0.5 uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] jb-crazy_card ${sellTypeInfo.name === 'NEW AT JB!'
                            ? 'bg-jb-blue text-white'
                            : sellTypeInfo.name === 'ON SALE'
                                ? 'bg-jb-red text-white'
                                : ''
                            }`}
                    >
                        {sellTypeInfo.name}
                    </span>
                )}
            </div>

            {/* Top Header Tagline & Similar Items CTA */}
            <div className="flex justify-between items-center mb-2 md:mb-6">
                <div>
                    {tagLineInfo?.name && (
                        <span className="jb-callout-logo leading-4 text-sm border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-jb-red px-1.5 py-0.5 uppercase bg-white">
                            {tagLineInfo.name}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    className="hidden md:flex items-center gap-1 text-sm font-bold hover:underline"
                >
                    Similar items <ChevronRight size={18} />
                </button>
            </div>

            {/* Mobile Header Info */}
            <div className="block md:hidden">
                <h1 className="text-2xl font-black text-black leading-7">
                    {title}
                    {currentStorage || currentColor ? (
                        <span className="ml-1.5">
                            {[currentStorage].filter(Boolean).join(' ')} <br />
                            ({[currentColor].filter(Boolean).join(' ')})
                        </span>
                    ) : null}
                </h1>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <div className="flex text-jb-yellow">
                            {[...Array(5)].map((_, i) => {
                                const rating = ratings ?? 0;
                                const isFilled = i < Math.floor(rating);
                                return (
                                    <Star
                                        key={i}
                                        size={18}
                                        fill={isFilled ? 'currentColor' : 'none'}
                                        className={
                                            isFilled ? 'text-jb-yellow' : 'text-gray-300'
                                        }
                                    />
                                );
                            })}
                        </div>
                        <span className="text-sm font-bold text-black">
                            {ratings ? ratings.toFixed(1) : '5.0'} ({reviews?.length ?? 2})
                        </span>
                        <button
                            type="button"
                            className="text-sm font-medium ml-2 hover:text-gray-700"
                        >
                            Write a review
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 font-medium flex gap-3 mt-1">
                        {selectedVariant?.productModel && (
                            <span>MODEL: {selectedVariant.productModel}</span>
                        )}
                        {selectedVariant?.sku && (
                            <span>SKU: {selectedVariant.sku}</span>
                        )}
                    </div>
                </div>
            </div>

            <button
                type="button"
                className="flex md:hidden items-center justify-end my-2 gap-1 text-sm font-bold hover:underline"
            >
                Similar items <ChevronRight size={18} />
            </button>

            {/* MOBILE SLIDER (< md) */}
            <div className="block md:hidden w-full">
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[330px]"
                >
                    {galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="w-full flex-shrink-0 snap-center flex items-center justify-center p-2"
                        >
                            <img
                                src={img}
                                alt={`${title} image ${idx + 1}`}
                                className="max-h-full max-w-full object-contain"
                            />
                        </div>
                    ))}
                </div>

                <div className="text-center text-xs font-semibold text-gray-600 mt-2">
                    {galleryImages.length > 0
                        ? `${currentIndex + 1} of ${galleryImages.length} images`
                        : ''}
                </div>

                {galleryImages.length > 0 && (
                    <div className="w-full bg-gray-200 h-1 mt-2 rounded-full overflow-hidden">
                        <div
                            className="bg-jb-yellow h-full transition-all duration-200"
                            style={{
                                width: `${((currentIndex + 1) / galleryImages.length) * 100}%`
                            }}
                        />
                    </div>
                )}
            </div>

            {/* DESKTOP VIEW (>= md) */}
            <div className="hidden md:flex flex-row gap-4">
                {/* Thumbnail Column */}
                <div>
                    <div className="grid grid-cols-2 gap-2">
                        {galleryImages.map((img, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setSelectedImage(img)}
                                className={`w-16 h-16 flex items-center justify-center transition-all ${selectedImage === img
                                    ? 'border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                    : 'border border-gray-300 hover:border-gray-500'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="max-h-full max-w-full object-contain"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Featured Image Viewport */}
                <div className="flex-1 h-[500px] flex items-center justify-center relative">
                    <img
                        src={selectedImage || galleryImages[0]}
                        alt={`${title} ${currentColor || ''}`}
                        className="max-h-full max-w-full object-contain transition-opacity duration-150"
                    />
                </div>
            </div>

            {/* Cart & Action Buttons */}
            <div className="flex md:hidden flex-col gap-2 mt-4">
                <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center justify-center gap-2 border border-black p-3 cursor-pointer font-bold text-sm bg-white hover:bg-gray-50">
                        <input type="checkbox" className="w-4 h-4 accent-black" />
                        <span>Compare</span>
                    </label>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 border border-black p-3 font-bold text-sm bg-white hover:bg-gray-50"
                    >
                        <Heart size={20} />
                        <span>Wishlist</span>
                    </button>
                </div>
            </div>

            {/* Color Variant Selector */}
            {variants.length > 1 && uniqueColorVariants.length > 0 && (
                <div className="flex flex-col gap-2 mt-5">
                    <span className="font-bold text-sm text-black">
                        Colour: {currentColor || 'Standard'}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {uniqueColorVariants.map((v) => {
                            const colorVal = v.color || 'Standard';
                            const isSelected =
                                (selectedVariant?.color || 'Standard').toLowerCase().trim() ===
                                colorVal.toLowerCase().trim();

                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => handleColorSelect(colorVal)}
                                    className={`w-16 h-16 rounded p-1 bg-white relative flex items-center justify-center transition-all overflow-hidden ${isSelected
                                        ? ''
                                        : 'border-gray-300 border hover:border-gray-400'
                                        }`}
                                >
                                    <img
                                        src={v.imagePath || mainImage}
                                        alt={colorVal}
                                        className="max-h-full max-w-full object-contain"
                                    />

                                    {/* Translucent Active Overlay */}
                                    {isSelected && (
                                        <div className="absolute inset-0 bg-jb-yellow/50 pointer-events-none" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Storage Variant Selector */}
            {variants.length > 1 && uniqueStorageVariants.length > 0 && (
                <div className="flex flex-col gap-2 mt-5">
                    <span className="font-bold text-sm text-black">
                        Internal storage: {currentStorage}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {uniqueStorageVariants.map((v) => {
                            const storageVal = v.specifications?.find(
                                (s) =>
                                    s.name.toLowerCase() === 'internal storage' ||
                                    s.name.toLowerCase() === 'storage'
                            )?.value || '';

                            const isSelected =
                                currentStorage.toLowerCase().trim() === storageVal.toLowerCase().trim();

                            const contextualVariant =
                                variants.find(
                                    (item) =>
                                        (item.specifications?.find(
                                            (s) =>
                                                s.name.toLowerCase() === 'internal storage' ||
                                                s.name.toLowerCase() === 'storage'
                                        )?.value || '').toLowerCase().trim() === storageVal.toLowerCase().trim() &&
                                        (item.color || '').toLowerCase().trim() ===
                                        (selectedVariant?.color || '').toLowerCase().trim()
                                ) || v;

                            return (
                                <button
                                    key={v.id}
                                    type="button"
                                    onClick={() => handleStorageSelect(storageVal)}
                                    className={`px-4 py-2 font-bold rounded transition-all flex flex-col items-center justify-center gap-0.5 ${isSelected
                                        ? 'bg-jb-yellow shadow-sm'
                                        : 'border-gray-300 border hover:border-gray-400 bg-white'
                                        }`}
                                >
                                    <span>{storageVal}</span>
                                    <span className="text-sm font-normal text-gray-500">
                                        ${contextualVariant.price || contextualVariant.originalPrice}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Yellow JB Deal Box */}
            <div className="block md:hidden bg-jb-yellow border-1 border-black p-4 mt-6 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="jb-crazy text-center text-xl md:text-2xl font-black text-black uppercase tracking-tight leading-none">
                        SEEN IT<br />CHEAPER?
                    </h2>

                    <div className="relative border-4 border-jb-red pt-2 pb-3 px-3 text-center min-w-[120px]">
                        <h3 className="jb-crazy text-lg text-jb-red uppercase tracking-tight leading-none font-black">
                            ASK FOR A <br />
                            <span className="text-2xl font-black">
                                JB DEAL!
                            </span>
                        </h3>

                        <div className="jb-callout-yellow absolute -bottom-3 left-1/2 -translate-x-1/2 bg-jb-red text-jb-yellow font-black text-xs px-1.5 py-0.5 uppercase tracking-wider whitespace-nowrap">
                            INSTORE | ONLINE
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-5 items-center gap-2 text-black text-sm sm:text-base">
                    <div className="flex gap-10 font-bold">
                        <Link
                            href="#"
                            className="flex items-center gap-1 hover:underline transition-all"
                        >
                            <MessageSquare size={18} strokeWidth={2.5} />
                            <span>Live chat</span>
                        </Link>

                        <a
                            href="tel:135244"
                            className="flex items-center gap-1 hover:underline transition-all"
                        >
                            <Phone size={18} strokeWidth={2.5} />
                            <span>Call 13 52 44</span>
                        </a>
                    </div>

                    <span className="mt-1">
                        4am – 3pm (GMT+5:30)
                    </span>
                </div>

                <div className="text-xs text-center text-gray-800 mt-1.5 font-medium">
                    Excludes JB Hi-Fi Marketplace products
                </div>
            </div>

            {/* Promo & Cross-Sell Recommendation Banners */}
            <div className="md:mt-12 hidden md:flex flex-col gap-12 col-span-full">
                <div>
                    <h2 className="font-black text-xl uppercase mb-4">
                        Don&apos;t Miss Out On These!
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-2 border-black bg-white p-4 flex flex-col justify-between">
                            <div>
                                <div className="bg-red-600 text-white font-black text-lg p-2 uppercase text-center border-b-2 border-black mb-3">
                                    Get An Instant Trade-In Gift Card
                                </div>
                                <p className="text-xs leading-relaxed font-medium">
                                    Trade-in* for an instant JB eGift card, plus $100 off the
                                    iPhone range via JB Coupon when you Trade-in an eligible
                                    device and redeem by deadline.
                                </p>
                                <ul className="list-disc list-inside text-xs mt-2 space-y-1 text-gray-700">
                                    <li>Quick online quote</li>
                                    <li>28 days to return your old device</li>
                                    <li>Free postage of old device</li>
                                </ul>
                            </div>
                            <a
                                href="#"
                                className="inline-flex items-center gap-1 font-bold text-xs underline mt-4"
                            >
                                Trade your old phone in now &gt;
                            </a>
                        </div>

                        <div className="border-2 border-black bg-white p-4 flex flex-col justify-between">
                            <div>
                                <div className="bg-jb-yellow text-black font-black text-lg p-2 uppercase text-center border-b-2 border-black mb-3">
                                    Plan Offer Available
                                </div>
                                <p className="text-xs leading-relaxed font-medium">
                                    Get up to $1200 off an eligible device when you connect your
                                    number to an eligible plan over 24 months.
                                </p>
                                <ul className="list-disc list-inside text-xs mt-2 space-y-1 text-gray-700">
                                    <li>Unlimited talk & text</li>
                                    <li>Min Plan Cost applies</li>
                                    <li>Instore only</li>
                                </ul>
                            </div>
                            <a
                                href="#"
                                className="inline-flex items-center gap-1 font-bold text-xs underline mt-4"
                            >
                                View full terms and conditions &gt;
                            </a>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="jb-callout-logo font-black text-xl md:text-2xl uppercase mb-2">
                        Frequently Bought Together
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
                </div>
            </div>
        </div>
    );
};