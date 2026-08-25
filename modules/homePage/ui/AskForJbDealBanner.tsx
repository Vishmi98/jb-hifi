'use client';

import Link from 'next/link';
import { MessageSquare, Phone } from 'lucide-react';

export default function AskForJbDealBanner() {
    return (
        <section className="w-[95%] md:w-[90%] mx-auto bg-[#ffec0f] border-1 border-black p-4 sm:p-6 md:px-8 select-none my-6">
            <div className="mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">

                {/* Left Column: Title & Disclaimer */}
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <h2 className="whats-font text-3xl sm:text-4xl md:text-5xl text-black uppercase tracking-tight leading-none mb-1 text-center font-bold">
                        SEEN IT<br />CHEAPER?
                    </h2>
                    <p className="text-xs sm:text-sm font-semibold text-black text-center">
                        Excludes JB Hi-Fi Marketplace products
                    </p>
                </div>

                {/* Center Column: Red Stamped Box */}
                <div className="relative border-4 border-red-600 px-6 sm:px-10 py-4 sm:py-6 text-center my-2 lg:my-0">
                    <h3 className="whats-font text-3xl sm:text-5xl md:text-5xl text-red-600 uppercase tracking-tight leading-none font-bold">
                        ASK FOR A JB DEAL!
                    </h3>

                    {/* Badge overlapping bottom border */}
                    <div className="absolute text-[#ffec0f] -bottom-3.5 left-1/2 transform -translate-x-1/2 bg-red-600 font-black text-xs sm:text-sm px-3 py-0.5 uppercase tracking-wider">
                        INSTORE | ONLINE
                    </div>
                </div>

                {/* Right Column: Contact Actions */}
                <div className="flex flex-col items-center gap-2 text-black text-sm sm:text-base font-bold">
                    <Link
                        href="#"
                        className="flex items-center gap-2 hover:underline transition-all"
                    >
                        <MessageSquare size={18} strokeWidth={2.5} />
                        <span>Live chat</span>
                    </Link>

                    <a
                        href="tel:135244"
                        className="flex items-center gap-2 hover:underline transition-all"
                    >
                        <Phone size={18} strokeWidth={2.5} />
                        <span>Call 13 52 44</span>
                    </a>

                    <span className="text-xs font-semibold text-black/80 mt-1">
                        5am – 4pm (GMT+5:30)
                    </span>
                </div>

            </div>
        </section>
    );
}