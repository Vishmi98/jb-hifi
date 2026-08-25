'use client';

import HeroCarousel from '@/modules/homePage/ui/HeroCarousel';
import PromoGrid from '@/modules/homePage/ui/PromoGrid';
import CategoryCircles from '@/modules/homePage/ui/CategoryCircles';
import PerksRibbon from '@/modules/homePage/ui/PerksRibbon';
import ProductSection from '@/modules/homePage/ui/ProductSection';
import BrandPartners from '@/modules/homePage/ui/BrandPartners';
import WhatsTrendingSection from '@/modules/homePage/ui/WhatsTrendingSection';
import WhatsHotSection from '@/modules/homePage/ui/WhatsHotSection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroCarousel />
      <CategoryCircles />
      <WhatsTrendingSection />
      <WhatsHotSection />

    
    </div>
  );
}
