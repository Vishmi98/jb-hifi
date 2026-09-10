'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { SubCategoryDataType } from '../subCategory.types';


interface SubCategoryCardProps {
    category: SubCategoryDataType;
    href?: string;
}

export const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ category, href }) => {
    // Default fallback if href isn't provided directly
    const targetHref = href || `/collections/${category.categoryInfo?.slug}/${category.mainCategoryInfo?.mainSlug}/${category.subSlug}`;

    return (
        <Link
            href={targetHref}
            className="flex flex-col items-center shrink-0 w-[110px] sm:w-[120px] group text-center py-2"
        >
            {/* White Circular Badge Frame */}
            <div className="md:w-[100px] md:h-[100px] w-[85px] h-[85px] rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 relative">
                {category.imagePath ? (
                    <Image
                        src={category.imagePath}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 85px, 100px"
                        className="object-cover p-3"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-400 font-semibold">
                        No Image
                    </div>
                )}
            </div>

            {/* Title Label */}
            <span className="mt-3 text-xs sm:text-base font-medium text-black leading-tight max-w-[120px] line-clamp-2">
                {category.name}
            </span>
        </Link>
    );
};