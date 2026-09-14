'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

import { StoreOverviewProps } from '../store.types';


type TabType = 'products' | 'shipping' | 'returns';

const StoreOverview = ({ store }: StoreOverviewProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('products');

    const {
        name,
        description,
        logoPath,
        shipping,
    } = store;

    return (
        <div className="min-h-screen w-full bg-white text-black select-none">
            <div className="w-[95%] md:w-[90%] mx-auto pt-6">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-700 mb-8">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <ChevronRight size={14} strokeWidth={3} className="text-gray-500" />
                    <Link href="/marketplace" className="hover:underline">
                        Marketplace
                    </Link>
                    <ChevronRight size={14} strokeWidth={3} className="text-gray-500" />
                    <span className="font-bold text-black">{name}</span>
                </nav>

                {/* Store Header Section */}
                <div className="flex items-start gap-5 mb-8">
                    {/* Logo Frame */}
                    <div className="w-24 h-24 sm:w-26 sm:h-26 shrink-0 bg-white border border-gray-200 shadow-sm flex items-center justify-center relative overflow-hidden">
                        {logoPath ? (
                            <Image
                                src={logoPath}
                                alt={name}
                                fill
                                sizes="112px"
                                className="object-contain p-2"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400">
                                NO LOGO
                            </div>
                        )}
                    </div>

                    {/* Title and Subtitle */}
                    <div className="flex flex-col justify-center pt-1">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tight leading-tight">
                            {name}
                        </h1>
                        <p className="text-sm sm:text-base font-medium text-gray-500 mt-1">
                            JB Hi-Fi Marketplace seller
                        </p>
                    </div>
                </div>

                {/* Store Description */}
                {description && (
                    <p className="text-base font-normal text-black max-w-full mb-10">
                        {description}
                    </p>
                )}

                {/* Navigation Tabs */}
                <div className="w-full border-b border-black">
                    <div className="flex gap-8 sm:gap-12">
                        <button
                            type="button"
                            onClick={() => setActiveTab('products')}
                            className={`pb-3 text-base sm:text-lg font-bold transition-all relative ${activeTab === 'products'
                                ? 'text-black'
                                : 'text-black hover:opacity-75'
                                }`}
                        >
                            Products
                            {activeTab === 'products' && (
                                <span className="absolute bottom-0 left-0 w-full h-[5px] bg-[#ffec0f]" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('shipping')}
                            className={`pb-3 text-base sm:text-lg font-bold transition-all relative ${activeTab === 'shipping'
                                ? 'text-black'
                                : 'text-black hover:opacity-75'
                                }`}
                        >
                            Shipping
                            {activeTab === 'shipping' && (
                                <span className="absolute bottom-0 left-0 w-full h-[5px] bg-[#ffec0f]" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('returns')}
                            className={`pb-3 text-base sm:text-lg font-bold transition-all relative ${activeTab === 'returns'
                                ? 'text-black'
                                : 'text-black hover:opacity-75'
                                }`}
                        >
                            Returns & Refunds policy
                            {activeTab === 'returns' && (
                                <span className="absolute bottom-0 left-0 w-full h-[5px] bg-[#ffec0f]" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Tab Content Display */}
                <div className="py-8">
                    {activeTab === 'products' && (
                        <div className="text-base font-normal text-gray-700">
                            {/* Render store products here */}
                            <p>No products loaded for this seller yet.</p>
                        </div>
                    )}

                    {activeTab === 'shipping' && (
                        <div className="space-y-5">
                            {shipping?.shortDescription && (
                                <p className="text-base sm:text-lg text-black leading-relaxed">
                                    {shipping.shortDescription}
                                </p>
                            )}

                            {shipping?.faq && shipping.faq.length > 0 ? (
                                shipping.faq.map((item, index) => (
                                    <div key={index}>
                                        {item.question && (
                                            <h3 className="text-base sm:text-lg font-extrabold text-black">
                                                {item.question}
                                            </h3>
                                        )}
                                        {item.answer && (
                                            <p className="text-base sm:text-lg text-black leading-relaxed">
                                                {item.answer}
                                            </p>

                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-1.5">

                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'returns' && (
                        <div className="space-y-3">
                            <p className="text-base sm:text-lg text-black leading-relaxed">
                                To view our Marketplace Return & Refund Policies, please refer to the <span className='underline'>Marketplace Terms of Sale</span>
                            </p>
                        </div>
                    )}
                </div>

                <p className='mt-10 text-gray-500'>
                    ^Discounts apply to previous ticketed / advertised price prior to the discount offer. As we negotiate, products will likely
                    have been sold below ticketed / advertised price prior to the discount offer. Prices may differ at airport stores.
                </p>
            </div>
        </div>
    );
};

export default StoreOverview;