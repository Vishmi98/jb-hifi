'use client';

import { BRANDS } from '@/constants/data';

export default function BrandPartners() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-zinc-200 p-6 md:p-8">
        <h3 className="text-sm font-black uppercase text-zinc-400 tracking-wider mb-6 text-center">
          Shop by Top Brand
        </h3>
        
        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-6 items-center justify-items-center">
          {BRANDS.map((brand) => (
            <button
              key={brand.name}
              className="flex items-center justify-center p-4 h-16 w-full rounded-lg border border-transparent hover:border-zinc-150 hover:bg-zinc-50 hover:shadow-sm transition-all group focus:outline-none"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="max-h-8 max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-200"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
