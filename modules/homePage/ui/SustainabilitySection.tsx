'use client';

import React from 'react';

import { SUSTAINABILITY_ITEMS } from '@/constants/data';


export default function SustainabilitySection() {
    return (
        <section className="w-full bg-[#f4f4f4] py-12">
            <div className="mx-auto w-[95%]">
                {/* Title */}
                <h2 className="jb-callout-logo text-2xl md:text-4xl mb-4">
                    SUSTAINABILITY AT JB
                </h2>

                {/* Subtitle Description */}
                <p className="leading-snug my-8">
                    We believe that good business is about doing the right thing and we strive to have a positive impact on the community and the environment where our team and customers live, work and play.
                </p>

                {/* Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-20">
                    {SUSTAINABILITY_ITEMS.map((item) => (
                        <a
                            key={item.id}
                            href={item.href || '#'}
                            className="bg-white shadow-[2px_2px_0_#d1d5dc] border border-gray-300 flex flex-col items-center justify-between text-center min-h-[210px]"
                        >
                            {/* Graphic / Image Container */}
                            <div className="flex-1 flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="max-h-40 max-w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="bg-black text-white p-8 flex flex-col md:flex-row items-center justify-between gap-5 overflow-hidden relative">

                    {/* Left: Single Magazine Composite Image */}
                    <div className="w-full md:w-2/5 flex items-center justify-center shrink-0">
                        <img
                            src="https://images.ctfassets.net/xa93kvziwaye/4dNIkIBtX2IfLRhn7QAIrZ/5bc2a8554d7c125810b8fd8c9cc8beaf/st262-LatestIssueCovers.png?fm=webp&f=top&fit=fill&q=75&w=768&h=359"
                            alt="STACK Magazines collection showing Music, Gaming, Samsung, and Project Hail Mary covers"
                            className="w-full h-auto object-contain"
                        />
                    </div>

                    {/* Right: Copy & CTA */}
                    <div className="w-full md:w-3/5 flex flex-col items-start justify-center text-left">
                        <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-tight mb-4">
                            Check out the latest STACK mag!
                        </h2>

                        <p className="text-gray-200 text-sm sm:text-base mb-8 max-w-[540px]">
                            In tech, we unpack new Samsung Galaxy Z foldables, plus shavers and trimmers, and coffee machines. In movies it&apos;s all systems go for Project Hail Mary, in games the battle is on in Marvel Tokon: Fighting Souls, and in music DMA&apos;S are back with a banger.
                        </p>

                        <a
                            href="/latest-mag"
                            className="bg-white w-full md:w-auto text-black font-bold text-sm sm:text-base py-3 px-8 shadow hover:bg-neutral-200 transition-colors inline-block text-center"
                        >
                            Read the STACK mag
                        </a>
                    </div>

                </div>

                <p className='my-20 text-gray-500'>
                    ^Discounts apply to previous ticketed / advertised price prior to the discount offer. As we negotiate, products will likely
                    have been sold below ticketed / advertised price prior to the discount offer. Prices may differ at airport stores.
                </p>
            </div>
        </section>
    );
}