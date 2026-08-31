'use client';

import { Play } from 'lucide-react';

export interface Product {
    id: number;
    image: string;
    brand?: string;
    description: string;
    button: string;
    video?: boolean;
}

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="flex-[0_0_220px] h-[442px] bg-white border-2 border-black shadow-[2px_2px_0_#000000] flex flex-col overflow-hidden box-border">
            {/* Image Container */}
            <div className="h-[360px] relative overflow-hidden bg-white">
                <img
                    src={product.image}
                    alt={product.description}
                    className="w-full h-full object-cover block"
                />

                {/* Play button overlay */}
                {product.video && (
                    <button
                        type="button"
                        aria-label="Play video"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[55px] h-[55px] rounded-full border-2 border-black bg-jb-yellow flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                    >
                        <Play
                            size={25}
                            fill="#000000"
                            color="#000000"
                        />
                    </button>
                )}
            </div>

            {/* Card Footer */}
            <div className="flex-1 bg-white p-2 flex items-center justify-between gap-[5px]">
                <div className="font-sans text-[11px] leading-[1.15] text-black flex-1">
                    {product.description}
                </div>

                <button
                    type="button"
                    className="shrink-0 bg-black text-white border-none py-2.5 px-[10px] font-sans text-[11px] font-black cursor-pointer hover:bg-neutral-800 transition-colors"
                >
                    {product.button}
                </button>
            </div>
        </div>
    );
}