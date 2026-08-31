'use client';

import { Heart, Star } from 'lucide-react';

import { ProductDataType } from '../homePage.types';


interface ProductCardProps {
    prod: ProductDataType;
}

export default function ProductCard({ prod }: ProductCardProps) {
    return (
        <div
            key={prod.id}
            className="shrink-0 w-[200px] sm:w-[250px] border border-gray-200 bg-white flex flex-col justify-between p-1 md:p-3 relative group hover:border-black transition-all"
        >
            {/* Top Badges & Favorite Heart */}
            <div className="flex justify-between items-start mb-2 relative z-10 min-h-[40px]">
                <div className="flex flex-col gap-1 items-start">
                    {/* Badge 1 */}
                    {prod.badgeType === 'outline-red' && (
                        <span className="border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-jb-red font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider bg-white">
                            {prod.badge}
                        </span>
                    )}
                    {prod.badgeType === 'solid-red' && (
                        <span className="bg-jb-red text-white font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.badge}
                        </span>
                    )}
                    {prod.badgeType === 'purple' && prod.badge === 'BUNDLE_BUY' && (
                        <span className="bg-jb-purple text-jb-yellow font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.badge}
                        </span>
                    )}

                    {/* Secondary Badge */}
                    {prod.secondaryBadge && (
                        <span className="bg-jb-purple text-jb-yellow font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.secondaryBadge}
                        </span>
                    )}

                    {prod.badgeType === 'purple' && prod.badge === 'PRE-ORDER' && (
                        <span className="bg-jb-purple text-white font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.badge}
                        </span>
                    )}

                    {prod.badgeType === 'blue' && prod.badge === 'NEW AT JB!' && (
                        <span className="bg-jb-blue text-white font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.badge}
                        </span>
                    )}

                    {prod.badgeType2 === 'outline-red' && (
                        <span className="border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-jb-red font-black text-[10px] px-1.5 py-0.5 uppercase tracking-wider bg-white">
                            {prod.badge2}
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
                {Boolean(prod?.rating && prod?.reviews) && (
                    <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-jb-yellow">
                            {[...Array(5)].map((_, i) => {
                                const rating = prod?.rating ?? 0;
                                const isFilled = i < Math.floor(rating);
                                return (
                                    <Star
                                        key={i}
                                        size={12}
                                        fill={isFilled ? 'currentColor' : 'none'}
                                        className={isFilled ? 'text-jb-yellow' : 'text-gray-300'}
                                    />
                                );
                            })}
                        </div>
                        <span className="text-[11px] text-gray-500 font-semibold">
                            {prod?.rating} ({prod?.reviews})
                        </span>
                    </div>
                )}

                {/* JB Price Tag Widget */}
                <div className="m-5 flex flex-col items-center">
                    <div className="bg-jb-yellow border-1 border-black pt-1.5 w-full text-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        {/* Crossed Out Original Price Ticket */}
                        {prod.originalPrice && (
                            <div className="absolute right-8 md:right-14 bg-jb-red text-white font-black text-[10px] px-1.5 uppercase inline-block -mt-3 mb-0.5 transform line-through">
                                TICKET ${prod.originalPrice}
                            </div>
                        )}

                        {/* RED HOT DEAL Label Header */}
                        {prod.priceTagLabel && (
                            <div className="absolute right-8 md:right-14 bg-jb-red text-white font-black text-[10px] px-1.5 uppercase inline-block -mt-3 mb-0.5 transform">
                                {prod.priceTagLabel}
                            </div>
                        )}

                        {/* Main Price */}
                        <div className="whats-font font-black text-jb-red leading-none flex items-center justify-center">
                            $
                            <span className='text-xl sm:text-2xl'>
                                {prod.price}
                            </span>
                        </div>

                        {/* Savings Subtext */}
                        {prod.savings && (
                            <div className="bg-jb-red text-white font-black text-sm uppercase py-1.5 px-1 mt-1 border border-black italic">
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
                    className="w-full bg-jb-green hover:bg-[#007300] text-white font-bold py-2.5 rounded-none transition-colors"
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
}