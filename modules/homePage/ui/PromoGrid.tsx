'use client';

import Link from 'next/link';
import { PROMO_TILES } from '@/constants/data';

export default function PromoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 mt-30">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROMO_TILES.map((tile) => (
          <div 
            key={tile.id} 
            className={`rounded-lg overflow-hidden flex flex-col justify-between shadow-md border border-zinc-200 transition-transform duration-250 hover:-translate-y-1 hover:shadow-lg ${tile.bgColor} ${tile.textColor}`}
          >
            {/* Promo Banner Image */}
            <div className="w-full h-44 overflow-hidden relative">
              <img 
                src={tile.image} 
                alt={tile.title} 
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Promo Content */}
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-black uppercase leading-tight tracking-tight">
                  {tile.title}
                </h3>
                <p className="text-xs font-semibold opacity-90 leading-normal">
                  {tile.subtitle}
                </p>
              </div>

              <div>
                <Link 
                  href={tile.ctaLink} 
                  className="inline-flex items-center justify-center w-full bg-jb-yellow text-black font-extrabold text-xs py-2.5 rounded hover:bg-[#e0b800] transition-colors uppercase tracking-wider"
                >
                  {tile.ctaText}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
