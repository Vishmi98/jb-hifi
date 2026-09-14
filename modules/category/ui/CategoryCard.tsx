'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { CategoryDataType } from '../category.types';


interface CategoryCardProps {
    category: CategoryDataType;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {

    const targetHref =
        category.slug === 'marketplace'
            ? '/marketplace'
            : `/collections/${category.slug}`;

    return (
        <Link
            href={targetHref}
            className="flex flex-col items-center shrink-0 w-auto group text-center py-2"
        >
            {/* White Circular Badge Frame */}
            <div className="md:w-[100px] md:h-[100px] w-[85px] h-[85px] rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105 relative">
                {category.imagePath ? (
                    <Image
                        src={category.imagePath}
                        alt={category.name}
                        fill
                        sizes="(max-width: 768px) 85px, 100px"
                        className="object-cover"
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