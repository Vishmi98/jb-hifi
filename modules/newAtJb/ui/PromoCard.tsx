import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play } from 'lucide-react';

import { PromoCardProps } from '../newAtJb.types';


export const PromoCard: React.FC<PromoCardProps> = ({
    imageSrc,
    description,
    buttonText,
    buttonHref,
    hasPlayOverlay = false,
}) => {
    return (
        <div className="w-[250px] sm:w-[270px] shrink-0 bg-white border-2 border-black flex flex-col snap-start shadow-lg">
            {/* Media Container */}
            <div className="relative aspect-[3/4] w-full bg-black overflow-hidden group">
                <Image
                    src={imageSrc}
                    alt={description}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Play Button Overlay */}
                {hasPlayOverlay && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                        <div className="w-16 h-16 bg-[#C8FD00] rounded-full border-2 border-black flex items-center justify-center shadow-md">
                            <Play className="w-8 h-8 fill-black text-black ml-1" />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Content */}
            <div className="p-3 bg-[#F4F4F4] flex items-center justify-between gap-2 border-t border-black min-h-[76px]">
                <p className="text-xs font-semibold text-black leading-tight flex-1 line-clamp-2">
                    {description}
                </p>
                <Link
                    href={buttonHref}
                    className="bg-black text-white text-xs font-extrabold px-3 py-2 whitespace-nowrap hover:bg-[#C8FD00] hover:text-black transition-colors"
                >
                    {buttonText}
                </Link>
            </div>
        </div>
    );
};