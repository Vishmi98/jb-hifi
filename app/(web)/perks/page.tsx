'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Ticket, Percent, Megaphone, Cake, Trophy } from 'lucide-react';

const benefits = [
    {
        icon: Ticket,
        title: '$10 WELCOME COUPON',
        description: 'Get a $10 Perks coupon when you join. Valid for 28 days from issue.',
    },
    {
        icon: Percent,
        title: 'MEMBER EXCLUSIVE DEALS',
        description: 'Get it for less with Perks members only sales and offers.',
    },
    {
        icon: Megaphone,
        title: 'EARLY SALES ACCESS',
        description: 'Get priority access to our biggest and best sales.',
    },
    {
        icon: Cake,
        title: 'BIRTHDAY PERKS',
        description: "Tell us when it's your birthday month and we'll send you a gift to celebrate.",
    },
    {
        icon: Trophy,
        title: 'MEMBER EXCLUSIVE COMPETITIONS',
        description: "Get access to Perks competitions for a chance to win crackin' prizes.",
    },
];

export default function PerksPage() {
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black font-sans">
            {/* ================= HERO BANNER ================= */}
            <div
                className="bg-jb-yellow py-10 px-4 text-center border-b border-black/10 bg-repeat bg-center"
                style={{ backgroundImage: "url('/perk-bg.webp')" }}
            >
                <div className="max-w-xl mx-auto flex flex-col items-center">
                    <div className="">
                        {/* JB Hi-Fi Brand Logo */}
                        <img
                            src="/logo1.png"
                            alt="JB Hi-Fi"
                            className="h-8 sm:h-10 w-auto object-contain"
                        />

                        {/* SVG PERKS Badge */}
                        <span className="bg-black px-2.5 py-1 inline-flex items-center justify-center h-8 sm:h-10">
                            <svg
                                viewBox="10 40 140 40"
                                className="h-5 sm:h-6 w-auto fill-current text-white"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M 15.556 73.44 l -2.34 -24.84 c 2.54 -0.68 5.27 -1.02 8.19 -1.02 c 4.4 0 8.09 0.85 11.07 2.55 c 3 1.7 4.5 4.37 4.5 8.01 c 0 2.66 -0.96 4.73 -2.88 6.21 c -1.92 1.46 -4.2 2.19 -6.84 2.19 c -1.24 0 -2.38 -0.16 -3.42 -0.48 l 1.44 6.3 l -9.72 1.08 Z m 7.74 -12.96 c 1.44 -0.56 2.61 -1.22 3.51 -1.98 c 0.9 -0.76 1.35 -1.72 1.35 -2.88 c 0 -0.8 -0.31 -1.43 -0.93 -1.89 c -0.6 -0.48 -1.36 -0.72 -2.28 -0.72 c -0.52 0 -1.07 0.09 -1.65 0.27 v 7.2 Z M 42.914 70.92 l -1.8 -23.22 l 14.58 -1.8 l 0.36 5.22 l -7.74 0.9 l 0.54 4.68 l 5.04 -0.36 l 0.54 3.96 l -3.78 1.44 l 0.36 1.8 l 6.84 -0.54 l 0.54 9.9 l -15.48 -1.98 Z M 63.3 74.04 l -2.13 -25.29 c 1.46 -0.6 3.2 -1.08 5.22 -1.44 c 2.04 -0.36 3.99 -0.54 5.85 -0.54 c 2.16 0 3.97 0.25 5.43 0.75 c 1.48 0.48 2.39 1.21 2.73 2.19 c 0.34 0.98 0.51 1.94 0.51 2.88 c 0 1.14 -0.26 2.21 -0.78 3.21 c -0.5 1 -1.25 2.02 -2.25 3.06 l 9.54 7.02 l -10.11 7.17 l -5.07 -10.5 l -3.3 2.16 l 0.99 6.81 l -6.63 2.52 Z m 6.42 -15.96 c 1.22 -0.42 2.31 -1 3.27 -1.74 s 1.44 -1.57 1.44 -2.49 c 0 -0.3 -0.08 -0.62 -0.24 -0.96 c -0.14 -0.36 -0.34 -0.61 -0.6 -0.75 c -0.24 -0.16 -0.52 -0.24 -0.84 -0.24 c -0.62 0 -1.4 0.25 -2.34 0.75 c -0.92 0.48 -1.67 0.87 -2.25 1.17 l 1.56 4.26 Z M 91.838 70.92 l 0.54 -23.22 l 10.44 1.08 l -2.34 10.44 l 7.56 -9 l 8.64 0.18 l -9.9 10.26 l 10.44 9.9 l -11.7 2.16 l -5.94 -7.74 l -2.34 8.64 l -5.4 -2.7 Z M 120.173 68.85 l 4.35 -8.1 c 0.84 1.02 2.08 1.85 3.72 2.49 c 1.64 0.62 3.21 0.93 4.71 0.93 c 1.04 0 1.86 -0.15 2.46 -0.45 c 0.6 -0.3 0.9 -0.76 0.9 -1.38 c 0 -1.36 -1.07 -2.45 -3.21 -3.27 c -2.04 -0.62 -4.07 -1.25 -6.09 -1.89 c -2.26 -0.84 -3.44 -1.62 -3.54 -2.34 c -0.08 -0.74 -0.12 -1.25 -0.12 -1.53 c 0 -1.98 1.09 -3.43 3.27 -4.35 c 2.2 -0.94 4.61 -1.51 7.23 -1.71 c 2.64 -0.22 4.94 -0.39 6.9 -0.51 v 5.31 c -0.94 -0.36 -1.89 -0.66 -2.85 -0.9 c -0.96 -0.26 -1.83 -0.39 -2.61 -0.39 c -0.78 0 -1.39 0.14 -1.83 0.42 c -0.42 0.28 -0.63 0.76 -0.63 1.44 c 0 0.32 1.3 0.6 3.9 0.84 c 2.6 0.24 4.86 1 6.78 2.28 c 1.94 1.28 2.91 3.7 2.91 7.26 c 0 3.14 -1.33 5.66 -3.99 7.56 c -2.64 1.9 -5.72 2.85 -9.24 2.85 c -2.94 0 -5.39 -0.31 -7.35 -0.93 c -1.96 -0.62 -3.85 -1.83 -5.67 -3.63 Z" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>

            {/* ================= MAIN CONTENT CONTAINER ================= */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                {/* LEFT COLUMN: Benefits List */}
                <div className="md:col-span-7 space-y-8">
                    <h1 className="text-2xl sm:text-3xl font-medium leading-tight">
                        Join JB Hi-Fi Perks and you'll start getting free member benefits straight away.
                    </h1>

                    <div className="space-y-6">
                        {benefits.map((benefit, index) => {
                            const IconComponent = benefit.icon;
                            return (
                                <div key={index} className="flex items-start gap-4">
                                    <div className="shrink-0 p-3 bg-jb-yellow rounded-full text-black border border-black/10">
                                        <IconComponent size={24} strokeWidth={2.2} />
                                    </div>
                                    <div>
                                        <h3 className="jb-callout-logo text-sm sm:text-lg tracking-wide uppercase">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 leading-snug mt-0.5">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COLUMN: Sign-up Card */}
                <div className="md:col-span-5 bg-white border border-gray-200 rounded-sm p-6 sm:p-8 shadow-sm">
                    <h2 className="text-2xl sm:text-3xl font-black mb-6">Let the perks begin!</h2>

                    <p className="text-sm font-medium mb-3">Create a JB Perks membership with:</p>

                    {/* Social Sign-in Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-black py-2.5 px-3 font-bold text-sm hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span>Google</span>
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center gap-2 border border-black py-2.5 px-3 font-bold text-sm hover:bg-gray-50 transition"
                        >
                            <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            <span>Facebook</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-2 items-center mb-6">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="shrink mx-4 text-xs font-bold uppercase text-black">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                        <div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email address"
                                className="w-full h-11 px-3 border border-gray-300 rounded-sm text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {/* Terms Checkbox */}
                        <div className="flex items-start gap-2.5">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-black leading-tight cursor-pointer">
                                By becoming a JB Hi-Fi Perks member, I agree to the{' '}
                                <Link href="#" className="underline font-medium">
                                    JB Hi-Fi Perks terms and conditions
                                </Link>
                                ,{' '}
                                <Link href="#" className="underline font-medium">
                                    Privacy Policy
                                </Link>{' '}
                                and being subscribed to JB Hi-Fi marketing communications and Perks communications.
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white font-bold py-3 text-sm hover:bg-neutral-800 transition uppercase"
                        >
                            Continue
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}