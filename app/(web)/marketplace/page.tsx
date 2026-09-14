'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import MainCategoryCarousel from '@/modules/category/ui/MainCategoryCarousel';
import MarketplaceSellers from '@/modules/marketplace/ui/MarketplaceSellers';
import MarketplaceInfoCards from '@/modules/marketplace/ui/MarketplaceInfoCards';

interface MarketplacePageProps {
    // Pass categoryId as a prop if derived from a parent layout/route
    categoryId?: number;
}

export default function MarketplacePage({ categoryId }: MarketplacePageProps) {
    return (
        <main className="w-full bg-white select-none">
            {/* Top Yellow Banner */}
            <div className="bg-[#ffec0f]">
                <div className="w-[95%] md:w-[90%] py-6 mx-auto relative">
                    <div className="max-w-[1280px] mx-auto relative">

                        {/* Breadcrumb Navigation */}
                        <nav className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-black mb-4 md:mb-0 md:absolute md:top-0 md:left-0">
                            <Link href="/" className="hover:underline">
                                Home
                            </Link>
                            <ChevronRight size={14} strokeWidth={3} className="text-black" />
                            <span>Marketplace</span>
                        </nav>

                        {/* Centered Marketplace Logo */}
                        <div className="flex justify-center items-center py-4 md:py-8">
                            <Image
                                src="/Frame_4.webp"
                                alt="JB HI-FI Marketplace"
                                width={230}
                                height={150}
                                priority
                                className="h-auto w-auto object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Intro Description Text Section */}
            <div className="w-[95%] md:w-[90%] max-w-[1280px] mx-auto py-8 md:py-10 text-left space-y-8">
                <p className="text-lg md:text-xl font-normal text-black leading-snug">
                    We’ve partnered with other tech retailers and sellers around Australia to bring you even more of the latest tech and home entertainment. From{' '}
                    <Link href="/collections/refurbished-phones" className="underline font-normal hover:text-zinc-700">
                        refurbished phones
                    </Link>
                    ,{' '}
                    <Link href="/collections/pc-parts" className="underline font-normal hover:text-zinc-700">
                        PC parts
                    </Link>{' '}
                    and{' '}
                    <Link href="/collections/gaming-desktops" className="underline font-normal hover:text-zinc-700">
                        gaming desktops
                    </Link>{' '}
                    to our latest new categories featuring an awesome range of{' '}
                    <Link href="/collections/lego" className="underline font-normal hover:text-zinc-700">
                        LEGO
                    </Link>
                    ,{' '}
                    <Link href="/collections/office-supplies" className="underline font-normal hover:text-zinc-700">
                        office supplies
                    </Link>{' '}
                    and home{' '}
                    <Link href="/collections/fitness-equipment-and-gear" className="underline font-normal hover:text-zinc-700">
                        fitness equipment and gear
                    </Link>
                    .
                </p>

                {/* Sub-Categories Carousel (Pass categoryId string or fall back to 'marketplace') */}
                <MainCategoryCarousel categoryId={categoryId || 13} />

                {/* all stores */}
                <MarketplaceSellers />

            </div>
            <MarketplaceInfoCards />
        </main>
    );
}