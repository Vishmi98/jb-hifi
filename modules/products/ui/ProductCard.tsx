'use client';

import { Heart, Star } from 'lucide-react';
import Link from 'next/link';

import { ProductCardProps } from '../products.types';

import { slugifyProduct } from '@/utils/slug';


export default function ProductCard({ prod, variant }: ProductCardProps) {
    const currentVariant = variant || prod.variants?.[0];
    const imageUrl = currentVariant?.imagePath || prod.mainImage;

    const storageSpec = currentVariant?.specifications?.find(
        (spec) =>
            spec.name.toLowerCase() === 'internal storage' ||
            spec.name.toLowerCase() === 'storage'
    )?.value;

    // Construct slug segment dynamically without orphaned hyphens
    const storageSlug = slugifyProduct(storageSpec);
    const colorSlug = slugifyProduct(currentVariant?.color);

    const fullSlug = [prod.slug, storageSlug, colorSlug]
        .filter(Boolean)
        .join('-');

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleAddToCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const price = currentVariant?.price ?? 0;
    const originalPrice = currentVariant?.originalPrice ?? 0;
    const hasDiscount = price > 0 && originalPrice > price;
    const discountAmount = originalPrice - price;

    return (
        <div className="group shrink-0 w-full border border-gray-200 bg-white flex flex-col justify-between p-2 md:p-3 relative shadow transition-shadow hover:shadow-md">
            {/* Top Badges & Favorite Heart */}
            <div className="flex justify-between items-start mb-2 relative z-10 min-h-[40px]">
                <div className="flex flex-col gap-1 items-start">
                    {prod.sellTypeInfo?.name === 'NEW AT JB!' && (
                        <span className="jb-crazy_card text-sm md:text-base bg-jb-blue px-1.5 py-0.4 uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.sellTypeInfo.name}
                        </span>
                    )}
                    {prod.sellTypeInfo?.name === 'ON SALE' && (
                        <span className="jb-crazy_card text-sm md:text-base bg-jb-red px-1.5 py-0.4 uppercase border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {prod.sellTypeInfo.name}
                        </span>
                    )}
                    {prod.tagLineId > 0 && (
                        <span className="jb-callout-logo leading-4 text-sm border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-jb-red px-1.5 py-0.4 uppercase bg-white">
                            {prod.tagLineInfo?.name}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    aria-label="Add to Wishlist"
                    onClick={handleWishlistClick}
                    className="hover:text-jb-red transition-colors cursor-pointer"
                >
                    <Heart size={20} />
                </button>
            </div>

            <Link href={`/products/${fullSlug}`}>
                {/* Product Image */}
                <div className="w-full h-[130px] md:h-[180px] flex items-center justify-center">
                    <img
                        src={imageUrl}
                        alt={`${prod.title} ${currentVariant?.color ? `- ${currentVariant.color}` : ''}`}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-end mt-2">
                    {prod.brandId > 0 && (
                        <span className="text-xs font-black text-black uppercase tracking-tight">
                            {prod.brandInfo?.name}
                        </span>
                    )}
                    <h3 className="font-bold text-black leading-tight">
                        {prod.title}
                        {currentVariant?.color || storageSpec ? (
                            <span className="ml-1">
                                {[storageSpec].filter(Boolean).join(' ')} <br />
                                ({[currentVariant?.color].filter(Boolean).join(' ')})
                            </span>
                        ) : null}
                    </h3>

                    {/* Ratings */}
                    {Boolean(prod?.ratings && prod?.reviews) && (
                        <div className="flex items-center gap-1 my-2">
                            <div className="flex text-jb-yellow">
                                {[...Array(5)].map((_, i) => {
                                    const rating = prod?.ratings ?? 0;
                                    const isFilled = i < Math.floor(rating);
                                    return (
                                        <Star
                                            key={i}
                                            size={15}
                                            fill={isFilled ? 'currentColor' : 'none'}
                                            className={isFilled ? 'text-jb-yellow' : 'text-gray-300'}
                                        />
                                    );
                                })}
                            </div>
                            <span className="text-xs md:text-sm text-gray-500">
                                {prod?.ratings}.0 ({prod?.reviews?.length || 0})
                            </span>
                        </div>
                    )}

                    {/* JB Price Tag Widget */}
                    <div className="md:mx-8 my-2 md:my-4 flex flex-col items-center">
                        <div className="bg-jb-yellow border-1 border-black pt-1.5 w-full text-center relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            {/* Top Floating Ticket Tag */}
                            {hasDiscount && (
                                <div className="jb-callout-logo absolute -top-3.5 left-1/2 -translate-x-1/2 bg-jb-red text-white text-sm font-black px-1.5 py-0.4 tracking-wider whitespace-nowrap z-10 uppercase flex items-center gap-1">
                                    <span>TICKET</span>
                                    <span className="line-through decoration-black decoration-2 text-white">
                                        ${originalPrice}
                                    </span>
                                </div>
                            )}

                            {/* Main Active Price */}
                            <div className="jb-callout-logo font-black text-jb-red leading-none flex items-start justify-center gap-0.5">
                                <span className="text-lg">$</span>
                                <span className="text-3xl">
                                    {hasDiscount ? price : originalPrice || price}
                                </span>
                            </div>

                            {/* Bottom Red Discount Bar */}
                            {hasDiscount && (
                                <div className="bg-jb-red jb-callout-logo text-white font-black py-0.5 px-2 flex items-center justify-center gap-1 text-sm sm:text-base border-t border-black">
                                    <p className="flex items-start justify-center gap-0.5">
                                        <span className="text-sm pt-0.5">$</span>
                                        <span className="text-xl">{discountAmount}</span>
                                        <span className="uppercase text-xs tracking-tight pt-2 pl-1">
                                            OFF^
                                        </span>
                                    </p>
                                    <button
                                        type="button"
                                        aria-label="Discount info"
                                        className="ml-0.5 w-3.5 h-3.5 mt-1 rounded-full border border-white text-[9px] font-bold flex items-center justify-center bg-white text-jb-red transition-colors"
                                    >
                                        i
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <button
                type="button"
                onClick={handleAddToCartClick}
                className="w-full bg-jb-green hover:bg-[#007300] text-white font-bold py-2.5 rounded-none transition-colors cursor-pointer"
            >
                Add to cart
            </button>
        </div>
    );
}