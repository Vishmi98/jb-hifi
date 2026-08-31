'use client';

import HeroCarousel from '@/modules/homePage/ui/HeroCarousel';
import CategoryCircles from '@/modules/homePage/ui/CategoryCircles';
import WhatsTrendingSection from '@/modules/homePage/ui/WhatsTrendingSection';
import WhatsHotSection from '@/modules/homePage/ui/WhatsHotSection';
import AskForJbDealBanner from '@/modules/homePage/ui/AskForJbDealBanner';
import JustForYouSection from '@/modules/homePage/ui/JustForYouSection';
import TvsSmashed from '@/modules/homePage/ui/TvsSmashed';
import NewAtJBSection from '@/modules/homePage/ui/new/NewAtJBSection';
import LatestTech from '@/modules/homePage/ui/LatestTech';
import MoreThanProductsSection from '@/modules/homePage/ui/MoreThanProductsSection';
import BestBrandsSection from '@/modules/homePage/ui/BestBrandsSection';
import SustainabilitySection from '@/modules/homePage/ui/SustainabilitySection';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroCarousel />
      <CategoryCircles />
      <WhatsTrendingSection />
      <WhatsHotSection />
      <TvsSmashed />
      <AskForJbDealBanner />
      <JustForYouSection />
      <NewAtJBSection />
      <LatestTech />
      <MoreThanProductsSection />
      <BestBrandsSection />
      <SustainabilitySection />
    </div>
  );
}
