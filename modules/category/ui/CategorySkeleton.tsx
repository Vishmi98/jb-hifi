'use client';

import React from 'react';

interface CategorySkeletonProps {
    count?: number;
}

export const CategorySkeleton: React.FC<CategorySkeletonProps> = ({ count = 8 }) => {
    return (
        <div className="flex items-center justify-center gap-3 md:gap-14 overflow-hidden pb-4 px-2">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center shrink-0 w-[110px] sm:w-[120px] py-2 animate-pulse"
                >
                    {/* Skeleton Circle */}
                    <div className="md:w-[100px] md:h-[100px] w-[85px] h-[85px] rounded-full bg-gray-200 border border-gray-300" />
                    {/* Skeleton Text Bar */}
                    <div className="mt-3 h-4 w-20 bg-gray-200 rounded" />
                </div>
            ))}
        </div>
    );
};