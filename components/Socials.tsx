'use client';

import React, { useEffect, useState } from 'react';

export default function FloatingChatButton() {
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleWhatsAppClick = () => {
        window.open('https://wa.me/94767415866', '_blank', 'noopener,noreferrer');
    };

    if (!isHydrated) {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-[60]">
            <button
                onClick={handleWhatsAppClick}
                type="button"
                aria-label="Chat with support"
                className="w-15 h-15 bg-[#ffed00] hover:bg-[#ebd800] text-black rounded-full shadow-xl flex flex-col items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer relative"
            >
                {/* Chat Icon Container with Green Badge */}
                <div className="relative flex items-center justify-center">
                    {/* Square Chat Bubble SVG */}
                    <svg
                        className="w-6 h-6 text-black"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>

                    {/* Green Online Dot Badge */}
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#28a745] border-2 border-[#ffed00] rounded-full" />
                </div>

                {/* Text Stacked Below Icon */}
                <span className="text-[12px] font-bold text-black leading-tight mt-0.5 tracking-tight">
                    Chat
                </span>
            </button>
        </div>
    );
}