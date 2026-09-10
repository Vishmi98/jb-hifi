'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Truck } from 'lucide-react';

export default function TrackMyOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle order tracking logic here
        console.log('Tracking order:', { orderNumber, mobileNumber });
    };

    return (
        <div className="bg-[#F5F5F5] text-black flex flex-col justify-between font-sans">
            {/* Top Container */}
            <div className='pt-5'>
                {/* Breadcrumb Navigation */}
                <div className="w-[95%] md:w-[90%] mx-auto">
                    <nav className="flex items-center text-xs font-medium text-gray-700 gap-1.5">
                        <Link href="/" className="hover:underline">
                            Home
                        </Link>
                        <ChevronRight size={12} className="text-gray-500" />
                        <span className="text-gray-900 font-semibold">Track my order</span>
                    </nav>
                </div>

                {/* Form Section */}
                <main className="flex justify-center items-center px-4 pt-4 pb-16">
                    <div className="bg-white p-8 sm:p-10 w-full max-w-[450px] shadow-sm rounded-none border border-gray-100">
                        <h1 className="text-3xl font-extrabold text-black mb-6 tracking-tight">
                            Track my order
                        </h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Order Number Field */}
                            <div className="space-y-1.5">
                                <input
                                    type="text"
                                    id="orderNumber"
                                    value={orderNumber}
                                    onChange={(e) => setOrderNumber(e.target.value)}
                                    placeholder="Order number"
                                    className="w-full h-12 px-3.5 border border-gray-400 rounded-none text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <p className="text-sm text-gray-600 leading-snug">
                                    You can find this in the top right corner of your confirmation email. e.g. JB-123456
                                </p>
                            </div>

                            {/* Mobile Number Field */}
                            <div className="space-y-1.5">
                                <input
                                    type="tel"
                                    id="mobileNumber"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    placeholder="Mobile number"
                                    className="w-full h-12 px-3.5 border border-gray-400 rounded-none text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black transition-colors"
                                    required
                                />
                                <p className="text-sm text-gray-600 leading-snug">
                                    The number you provided when placing your order
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full h-12 bg-black text-white font-bold text-sm tracking-wide rounded-none hover:bg-gray-800 active:scale-[0.99] transition"
                            >
                                Track order
                            </button>
                        </form>
                    </div>
                </main>
            </div>

            {/* Bottom Footer Accent Bar & Icon */}
            <div className="max-w-7xl mx-auto px-10 md:px-30 flex justify-end">
                <div className="relative -mb-[8px] z-10">
                    <Truck size={70} strokeWidth={2} className="text-black fill-jb-yellow" />
                </div>
            </div>
        </div>
    );
}