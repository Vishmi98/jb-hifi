'use client';

import Link from 'next/link';
import { HelpCircle, Store } from 'lucide-react';


export default function MarketplaceInfoCards() {
    return (
        <section className="w-full bg-[#f5f5f5] py-12 md:py-16">
            <div className="w-[95%] md:w-[90%] max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">

                {/* FAQs Card */}
                <div className="flex flex-col items-start text-black">
                    {/* Yellow Circle Question Mark Icon */}
                    <div className="w-14 h-14 rounded-full bg-[#ffec0f] border-[3px] border-black flex items-center justify-center mb-4">
                        <HelpCircle size={32} strokeWidth={2.5} className="text-black" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                        FAQs
                    </h3>

                    <p className="text-base sm:text-lg font-normal text-black leading-snug mb-6 max-w-md">
                        Got questions about our Marketplace? Check out our help section.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center bg-white border border-black px-6 py-3 text-base font-bold text-black hover:bg-black hover:text-white transition-colors duration-200"
                    >
                        View FAQs
                    </Link>
                </div>

                {/* Become a Marketplace seller Card */}
                <div className="flex flex-col items-start text-black">
                    {/* Store Front Icon */}
                    <div className="w-14 h-14 bg-[#ffec0f] border-[3px] border-black flex items-center justify-center rounded-sm mb-4 relative">
                        <Store size={32} strokeWidth={2.5} className="text-black" />
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
                        Become a Marketplace seller
                    </h3>

                    <p className="text-base sm:text-lg font-normal text-black leading-snug mb-6 max-w-md">
                        Come and sell with Australia's biggest consumer electronics and home entertainment retailer.
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center bg-white border border-black px-6 py-3 text-base font-bold text-black hover:bg-black hover:text-white transition-colors duration-200"
                    >
                        Learn more
                    </Link>
                </div>

            </div>
        </section>
    );
}