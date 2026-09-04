import Image from 'next/image';
import React from 'react'

export const PAGES = [
  {
    id: 1,
    title: 'COVER PAGE',
    bg: 'from-amber-400 to-yellow-500',
    content: (
      <div className="relative w-full h-full bg-jb-yellow p-2 flex flex-col justify-between select-none overflow-hidden text-black">
        {/* 1. TOP HEADER SECTION */}
        <div className="flex flex-col gap-1 z-10">
          <div className="relative flex items-stretch justify-between">
            {/* JB Hi-Fi Brand Box */}
            <Image
              src="/mg-logo.png"
              alt="JB Hi-Fi Logo"
              width={92}
              height={90}
              className="object-contain border-2 border-black rounded-l-sm"
            />

            {/* Deals For Dad Banner */}
            <div className="flex-1 p-1 relative shadow-[4px_4px_0px_#000] h-16">
              <Image
                src="/dfd.png"
                alt="JB Hi-Fi Logo"
                fill
                className="object-cover border-2 border-black"
              />
            </div>
          </div>

          {/* Category Subheader */}
          <div className="jb-callout absolute rotate-[-1.5deg] top-16 right-3 bg-gradient-to-b from-gray-100 to-gray-300 border-2 border-black px-2 shadow-[2px_2px_0px_#000]">
            <span className="jb-callout text-sm font-bold">
              FITNESS, WEARABLES & OUTDOOR!
            </span>
          </div>
        </div>

        {/* 2. PRODUCTS SECTION */}
        <img
          src="/mg-c1.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[180px] h-[180px] object-contain absolute top-20 left-[-30]"
        />
        <img
          src="/mg-c2.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[220px] h-[220px] object-contain absolute top-11 right-0"
        />
        <img
          src="/mg-c3.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[100px] h-[100px] object-contain absolute top-48 right-0"
        />
        <img
          src="/mg-c4.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[120px] h-[120px] object-contain absolute top-50 right-24"
        />
        <img
          src="/mg-c5.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[150px] h-[150px] object-contain absolute top-65 left-[-15]"
        />
        <img
          src="/mg-c6.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[110px] h-[110px] object-contain absolute top-68 right-0"
        />
        <img
          src="/mg-c7.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[130px] h-[130px] object-contain absolute top-74 right-28"
        />
        <img
          src="/mg-c8.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-[130px] h-[130px] object-contain absolute top-83 right-2"
        />

        {/* 3. FOOTER SECTION */}
        <footer className="w-full text-black flex flex-col items-center justify-center text-center">
          {/* Main Promo Dates Line */}
          <p className="font-extrabold text-[6px] tracking-tighter">
            Starts Monday 24/08/2026, Ends Sunday 6/09/2026. See Page 19 For Conditions.
          </p>

          {/* Fine Print / Disclaimer Terms */}
          <p className="text-[5px] tracking-tighter leading-none">
            <strong className="font-extrabold"><sup>†</sup>See Page 3 for Details.</strong> ·Battery life based on manufacturer testing and can vary significantly based on usage, network and feature configuration, signal strength, settings and other factors. <sup>^</sup>Discounts apply to previous ticketed/advertised price prior to the discount offer at the time of printing 13/08/2026. As we negotiate, products will likely have been sold below ticketed/advertised price prior to the discount offer. Prices may differ at airport stores.
          </p>
        </footer>
      </div>
    ),
  },
  {
    id: 2,
    title: 'NEW AT JB!',
    bg: 'from-slate-100 to-gray-200',
    content: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-jb-yellow">
        <img
          src="/mg2.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 2"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
    ),
  },
  {
    id: 3,
    title: 'OURA RING',
    bg: 'from-stone-100 to-amber-50',
    content: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-jb-yellow">
        <img
          src="/mg3.png"
          alt="JB Hi-Fi Deals For Dad Catalog Page 3"
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>
    ),
  },
  {
    id: 4,
    title: 'TECH SPOTLIGHT',
    bg: 'from-slate-900 to-indigo-950',
    content: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-jb-yellow">
        {/* Base Background Image Layer */}
        <img
          src="/mg4.png"
          alt="Catalogue Background Base Layer"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />

        {/* SVG Vector Text / Details Layer */}
        <img
          src="https://catalogue.jbhifi.com.au/2026/08/24-08-dfd/files/assets/common/page-vectorlayers/0004.svg?uni=848e4263ba0ee3dbe7225a8cb8f5e113"
          alt="JB Hi-Fi Deals For Dad Catalog Page Layer"
          className="relative w-full h-full object-contain drop-shadow-md z-10"
        />
      </div>
    ),
  },
  {
    id: 5,
    title: 'BACK COVER',
    bg: 'from-neutral-950 to-black',
    content: (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-jb-yellow">
        {/* Base Background Image Layer */}
        <img
          src="/mg5.png"
          alt="Catalogue Background Base Layer"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        />

        {/* SVG Vector Text / Details Layer */}
        <img
          src="https://catalogue.jbhifi.com.au/2026/08/24-08-dfd/files/assets/common/page-vectorlayers/0005.svg?uni=848e4263ba0ee3dbe7225a8cb8f5e113"
          alt="JB Hi-Fi Deals For Dad Catalog Page Layer"
          className="relative w-full h-full object-contain drop-shadow-md z-10"
        />
      </div>
    ),
  },
];

export const MagPage = React.forwardRef<HTMLDivElement, { page: (typeof PAGES)[0] }>(
  ({ page }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full h-full shadow-xl overflow-hidden flex flex-col select-none"
      >
        {page.content}
      </div>
    );
  }
);

MagPage.displayName = 'MagPage';
