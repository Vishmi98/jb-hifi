'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, MessageSquare, Phone, Star, Ticket } from 'lucide-react';

import { ProductRightSectionProps } from '../products.types';
import Link from 'next/link';


export const ProductRightSection: React.FC<ProductRightSectionProps> = ({
    product,
    selectedVariant,
    currentColor,
    currentStorage,
    uniqueColorVariants,
    uniqueStorageVariants,
    handleColorSelect,
    handleStorageSelect,
}) => {
    const {
        title,
        ratings,
        reviews,
        sellTypeInfo,
        mainImage,
        variants = [],
        paymentMethodsInfo,
    } = product;

    // Calculate dynamic pricing derived from the active variant
    const price = selectedVariant?.price ?? 0;
    const originalPrice = selectedVariant?.originalPrice ?? 0;
    const hasDiscount = price > 0 && originalPrice > price;
    const discountAmount = originalPrice - price;

    return (
        <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="w-auto">
                {sellTypeInfo?.name && (
                    <span
                        className={`md:inline-block hidden text-sm px-1.5 py-0.5 uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] jb-crazy_card ${sellTypeInfo.name === 'NEW AT JB!'
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

            {/* Dynamic Title with Selected Specs */}
            <h1 className="hidden md:block text-xl md:text-2xl font-black text-black leading-7">
                {title}
                {currentStorage || currentColor ? (
                    <span className="ml-1.5">
                        {[currentStorage].filter(Boolean).join(' ')} <br />
                        ({[currentColor].filter(Boolean).join(' ')})
                    </span>
                ) : null}
            </h1>

            {/* Ratings & SKU Info */}
            <div className="hidden md:flex flex-col gap-1">
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
                        className="text-xs md:text-sm font-medium ml-2 hover:text-gray-700"
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

            {/* Price Tag Widget */}
            <div className="hidden md:block my-2 max-w-[200px]">
                <div className="bg-jb-yellow border-2 border-black text-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {hasDiscount && (
                        <div className="jb-callout-logo absolute -top-3.5 left-1/2 -translate-x-1/2 bg-jb-red text-white text-xs font-black px-2 py-0.5 tracking-wider whitespace-nowrap z-10 uppercase flex items-center gap-1 border border-black">
                            <span>TICKET</span>
                            <span className="line-through decoration-black decoration-2 text-white">
                                ${originalPrice}
                            </span>
                        </div>
                    )}

                    <div className="jb-callout-logo py-1 font-black text-jb-red leading-none flex items-start justify-center gap-0.5">
                        <span className="text-xl">$</span>
                        <span className="text-3xl md:text-4xl">
                            {hasDiscount ? price : originalPrice || price}
                        </span>
                    </div>

                    {hasDiscount && (
                        <div className="bg-jb-red jb-callout-logo text-white font-black py-1 px-2 flex items-center justify-center gap-1 border-t-2 border-black">
                            <span className="text-xl">${discountAmount}</span>
                            <span className="uppercase text-xs tracking-tight">
                                OFF^
                            </span>
                            <button
                                type="button"
                                aria-label="Discount info"
                                className="ml-1 w-4 h-4 rounded-full border border-white text-[10px] font-bold flex items-center justify-center bg-white text-jb-red"
                            >
                                i
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* BNPL Payment Methods */}
            <div className="flex items-center gap-3 py-2">
                {(paymentMethodsInfo || [])
                    .filter((method) => method?.isActive)
                    .map((method) => (
                        <div
                            key={method.id}
                            className="relative flex items-center h-6 w-14"
                            title={method.name}
                        >
                            <Image
                                src={method.logo || ''}
                                alt={method.name || 'Payment Method'}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 64px, 64px"
                            />
                        </div>
                    ))}
            </div>

            {/* Coupons Callout Box */}
            <div className="bg-gray-100 p-3 rounded flex items-center gap-3 text-sm border border-gray-200">
                <Ticket
                    className="text-jb-yellow fill-jb-yellow stroke-black shrink-0"
                    size={28}
                />
                <p>
                    <button type="button" className="underline font-bold text-black">
                        Log in
                    </button>{' '}
                    to see if you have coupons.
                </p>
            </div>

            {/* Color Variant Selector */}
            {variants.length > 1 && uniqueColorVariants.length > 0 && (
                <div className="hidden md:flex flex-col gap-2 mt-2">
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
                <div className="hidden md:flex flex-col gap-2 mt-2">
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

            {/* Cart & Action Buttons */}
            <div className="hidden md:flex flex-col gap-2 mt-4">
                <button
                    type="button"
                    className="w-full bg-jb-green hover:bg-[#007300] text-white font-black text-lg py-3 uppercase transition-colors"
                >
                    Add to cart
                </button>

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

            {/* Info Notice Boxes */}
            {product.categoryInfo?.name === "Mobile Phones" && <div className="flex flex-col gap-2 mt-2">
                <div className="border border-[#da6a00] bg-[#fff9f0] p-3 flex flex-col items-start">
                    <div className='flex items-center gap-2 justify-center'>
                        <span className="bg-[#da6a00] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            !
                        </span>
                        <span className="font-bold text-[#da6a00] mr-1">
                            Feature
                        </span>
                    </div>
                    <a
                        href="#compare"
                        className="ml-6 underline font-medium text-black hover:text-gray-700"
                    >
                        Compare iPhone models here
                    </a>
                </div>

                <div className="border border-[#da6a00] bg-[#fff9f0] p-3 flex flex-col items-start">
                    <div className='flex items-center gap-2 justify-center'>
                        <span className="bg-[#da6a00] text-white rounded-full w-4 h-4 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            !
                        </span>
                        <span className="font-bold text-[#da6a00] mr-1">
                            Please note:
                        </span>
                    </div>
                    <p
                        className="ml-6 font-medium text-black"
                    >
                        Limit 2 per customer
                    </p>
                </div>
            </div>}

            {/* Yellow JB Deal Box */}
            <div className="hidden md:block bg-jb-yellow border-1 border-black p-4 mt-2 relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between gap-3">
                    {/* Left Header */}
                    <h2 className="jb-crazy text-center text-xl md:text-2xl font-black text-black uppercase tracking-tight leading-none">
                        SEEN IT<br />CHEAPER?
                    </h2>

                    {/* Right Border Box with Overlapping Badge */}
                    <div className="relative border-4 border-jb-red pt-2 pb-3 px-3 text-center min-w-[120px]">
                        <h3 className="jb-crazy text-lg text-jb-red uppercase tracking-tight leading-none font-black">
                            ASK FOR A <br />
                            <span className="text-2xl font-black">
                                JB DEAL!
                            </span>
                        </h3>

                        {/* Badge overlapping bottom border */}
                        <div className="jb-callout-yellow absolute -bottom-3 left-1/2 -translate-x-1/2 bg-jb-red text-jb-yellow font-black text-xs px-1.5 py-0.5 uppercase tracking-wider whitespace-nowrap">
                            INSTORE | ONLINE
                        </div>
                    </div>
                </div>

                <div className="flex flex-col mt-5 items-center gap-2 text-black text-sm sm:text-base ">
                    <div className='flex gap-10 font-bold'>
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

                {/* Timezone Disclaimer */}
                <div className="text-xs text-center text-gray-800 mt-1.5 font-medium">
                    Excludes JB Hi-Fi Marketplace products
                </div>
            </div>

            {/* Key Features & Availability */}
            <div className="flex flex-col gap-4 mt-4 border-t pt-4">
                <div>
                    <h3 className="jb-callout-logo font-black text-xl md:text-2xl uppercase mb-2">
                        Key Features
                    </h3>
                    <ul className="list-disc list-inside text-gray-800 space-y-1">
                        {product.keyFeatures?.length > 0 ? (
                            product.keyFeatures.map((feature, index) => (
                                <li key={index}>
                                    {feature}
                                </li>
                            ))
                        ) : (
                            <li>No key features available.</li>
                        )}
                    </ul>
                    <a
                        href="#overview"
                        className="inline-block text-sm font-bold mt-4"
                    >
                        ↓ Product overview
                    </a>
                </div>

                <div>
                    <h3 className="jb-callout-logo font-black text-xl md:text-2xl uppercase mb-2">
                        Availability
                    </h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter postcode or suburb"
                            className="flex-1 border border-gray-300 p-3"
                        />
                    </div>
                    <button
                        type="button"
                        className="font-medium underline mt-1 text-right w-full"
                    >
                        Use my location
                    </button>
                </div>
            </div>

            {/* Promo & Cross-Sell Recommendation Banners */}
            <div className="md:mt-12 flex md:hidden flex-col gap-12 col-span-full">
                <div>
                    <h3 className="jb-callout-logo font-black text-xl md:text-2xl uppercase mb-2">
                        Don&apos;t Miss Out On These!
                    </h3>
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