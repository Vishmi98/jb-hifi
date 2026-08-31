'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';

import { BRANDS } from '@/constants/data';


export default function BestBrandsSection() {
    return (
        <section className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto w-[95%] md:w-[90%]">
                {/* Header Bar */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="sub-titles text-xl md:text-3xl">
                        ALL THE BEST BRANDS
                    </h2>

                    <a
                        href="#all-brands"
                        className="hidden md:flex items-center gap-1 text-black text-[13px] sm:text-[14px] font-bold hover:underline transition-all"
                    >
                        View all brands
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </a>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 items-center justify-items-center">
                    {BRANDS.map((brand) => (
                        <a
                            key={brand.id}
                            href={brand.href || '#'}
                            className="w-full h-[100px] sm:h-[200px] flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
                            title={brand.name}
                        >
                            <img
                                src={brand.logo}
                                alt={`${brand.name} logo`}
                                className="max-h-full w-full object-contain"
                                loading="lazy"
                            />
                        </a>
                    ))}
                </div>

                <a
                    href="#all-brands"
                    className="flex md:hidden items-center justify-end mt-3 gap-1 text-black font-bold hover:underline transition-all"
                >
                    View all brands
                    <ChevronRight size={16} strokeWidth={2.5} />
                </a>
            </div>
        </section>
    );
}