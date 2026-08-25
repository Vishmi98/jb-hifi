'use client';

import { useState } from 'react';
import { Star, ShoppingCart, Percent } from 'lucide-react';
import { PRODUCTS } from '@/constants/data';
import { Product } from '@/constants/types';

export default function ProductSection() {
  const [activeTab, setActiveTab] = useState<'deals' | 'sellers' | 'new'>('deals');

  // Filter products based on selected tab
  const getFilteredProducts = (): Product[] => {
    switch (activeTab) {
      case 'deals':
        return PRODUCTS.filter((p) => p.isPromo || (p.savings && p.savings > 0));
      case 'sellers':
        return PRODUCTS.filter((p) => p.rating >= 4.7);
      case 'new':
        return PRODUCTS.filter((p) => p.tag === 'NEW' || p.id.includes('phone') || p.id.includes('air'));
      default:
        return PRODUCTS;
    }
  };

  const filteredProducts = getFilteredProducts();

  // Helper to render rating stars
  const renderStars = (rating: number) => {
    const stars = [];
    const floor = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          className={`${
            i <= floor 
              ? 'text-[#ffd200] fill-[#ffd200]' 
              : i - 0.5 <= rating 
              ? 'text-[#ffd200] fill-[#ffd200] opacity-50' 
              : 'text-zinc-300'
          }`}
        />
      );
    }
    return stars;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-jb-yellow rounded-sm"></span>
            <h3 className="text-xl md:text-2xl font-black uppercase text-black tracking-tight ticket-font">
              Hot Tech Deals & Offers
            </h3>
          </div>
          <p className="text-xs text-zinc-500 font-semibold mt-1">Get the best prices in town on top quality electronics</p>
        </div>

        {/* Tab switchers */}
        <div className="flex gap-2 bg-zinc-150 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'deals' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            Hot Deals
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'sellers' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            Top Sellers
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'new' 
                ? 'bg-black text-white shadow-sm' 
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            New Arrivals
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-xl border border-zinc-200 hover:border-black/30 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group p-4"
          >
            {/* Image and Badges */}
            <div className="relative w-full h-48 flex items-center justify-center bg-zinc-50 rounded-lg overflow-hidden shrink-0">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-auto max-h-40 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Promo tags */}
              <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                {product.tag && (
                  <span className="bg-jb-red text-white text-[9px] font-black px-2 py-0.5 rounded tracking-wide uppercase leading-tight shadow-sm skew-x-[-4deg]">
                    {product.tag}
                  </span>
                )}
                {product.isOnlineOnly && (
                  <span className="bg-jb-blue text-white text-[9px] font-black px-2 py-0.5 rounded tracking-wide uppercase leading-tight shadow-sm skew-x-[-4deg]">
                    Online Only
                  </span>
                )}
              </div>
            </div>

            {/* Content info */}
            <div className="mt-4 flex-1 flex flex-col justify-between">
              
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-extrabold uppercase text-zinc-400 tracking-wider">
                  {product.brand}
                </span>
                <h4 className="text-sm font-bold text-zinc-900 leading-snug group-hover:text-jb-blue transition-colors line-clamp-2 min-h-10">
                  {product.name}
                </h4>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-[10px] font-extrabold text-zinc-400">({product.reviewCount})</span>
                </div>
              </div>

              {/* Pricing section - Iconic JB Ticket style */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col gap-1.5">
                {product.originalPrice && product.savings && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-bold line-through">
                      Ticket ${product.originalPrice}
                    </span>
                    <span className="bg-jb-red text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <Percent size={9} /> SAVE ${product.savings}
                    </span>
                  </div>
                )}

                <div className="flex items-end justify-between gap-2">
                  {/* Price Box */}
                  <div className="bg-jb-yellow border border-black/10 px-3 py-1 rounded shadow-sm inline-flex items-baseline gap-0.5 select-none leading-none">
                    <span className="text-sm font-black ticket-font">$</span>
                    <span className="text-2xl md:text-3xl font-black tracking-tight leading-none ticket-font font-black italic">
                      {Math.floor(product.price)}
                    </span>
                    <span className="text-xs font-black tracking-tight ticket-font">
                      .{(product.price % 1).toFixed(2).substring(2) || '00'}
                    </span>
                  </div>

                  {/* Add to cart quick button */}
                  <button 
                    className="bg-black text-white hover:bg-zinc-900 border-2 border-black p-2.5 rounded-lg transition-colors flex items-center justify-center hover:scale-105 active:scale-95 shadow-sm group/btn"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={16} className="text-[#ffd200] group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
