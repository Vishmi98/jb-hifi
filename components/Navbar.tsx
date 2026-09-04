'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Crosshair,
  ChevronRight,
  Heart,
  MapPin,
  HelpCircle,
  Building2,
  Laptop,
  Cpu,
  Tv,
  Headphones,
  Radio,
  Smartphone,
  Refrigerator,
  Gamepad2,
  Film,
  Music,
} from 'lucide-react';

import CartDrawer from './CartDrawer';

const categoryLinks = [
  { name: 'New', href: '#', hasDropdown: false },
  { name: 'Products', href: '#', hasDropdown: true },
  { name: 'Brands', href: '#', hasDropdown: true },
  { name: "Father's Day", href: '#', hasDropdown: true },
  { name: 'Deals & Catalogues', href: '#', hasDropdown: true },
  { name: 'Clearance', href: '#', hasDropdown: true },
  { name: 'Services', href: '#', hasDropdown: true },
  { name: 'Gift Cards', href: '#', hasDropdown: true },
  { name: 'Join JB Perks', href: '#', hasDropdown: false },
  { name: 'News & Reviews', href: '#', hasDropdown: false },
];

const productSubmenu = [
  { name: 'Computers & Tablets', icon: Laptop, href: '#' },
  { name: 'IT Accessories & PC Parts', icon: Cpu, href: '#' },
  { name: 'TVs & Home Theatre', icon: Tv, href: '#' },
  { name: 'Headphones, Speakers & Audio', icon: Headphones, href: '#' },
  { name: 'Smart Home', icon: Radio, href: '#' },
  { name: 'Mobile Phones', icon: Smartphone, href: '#' },
  { name: 'Home Appliances', icon: Refrigerator, href: '#' },
  { name: 'Gaming', icon: Gamepad2, href: '#' },
  { name: 'Movies & TV Shows', icon: Film, href: '#' },
  { name: 'Music & Vinyl', icon: Music, href: '#' },
];

const brandsSubmenu = [
  'Apple',
  'Beats',
  'Bose',
  'Breville',
  'DJI',
  'Dyson',
  'Eufy',
  'Fisher & Paykel',
  'Fitbit',
  'Garmin',
  'Google',
  'Hisense',
  'HP',
  'JBL',
  'Lenovo',
  'LG',
  'Logitech',
  'Nespresso',
  'Nintendo',
  'PlayStation',
  'Samsung',
  'Sonos',
  'Sony',
  'TCL',
  'Xbox',
];

const secondaryLinks = [
  { name: 'Track my order', href: '/track-my-order', icon: Crosshair },
  { name: 'Wish List', href: '#', icon: Heart },
  { name: 'Store Finder', href: '#', icon: MapPin },
  { name: 'Help & Support', href: '#', icon: HelpCircle },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Ref attached to the navigation container to detect outside clicks
  const navRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Close dropdown on outside click or Escape key press
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <header className="w-full bg-jb-yellow text-black relative z-50 select-none">
        {/* ================= MAIN HEADER ROW ================= */}
        <div className="mx-auto w-[95%] md:w-[90%]">
          <div className="h-[70px] flex items-center justify-between gap-6 lg:gap-10 w-full">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden shrink-0 flex flex-col items-center text-xs font-semibold p-1 hover:bg-black/10 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={26} strokeWidth={2.5} />
              ) : (
                <Menu size={26} strokeWidth={2.5} />
              )}
              <span>Menu</span>
            </button>

            {/* Logo */}
            <Link
              href="/"
              className="shrink-0 flex flex-col items-center justify-center"
            >
              <Image
                src="/logo1.png"
                alt="logo"
                width={155}
                height={155}
              />
              <span className="jb-callout-logo text-[12px] sm:text-[14px] font-medium leading-tight">
                ALWAYS CHEAP PRICES
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="flex-1 max-w-lg hidden sm:block">
              <div className="relative">
                <Search
                  size={18}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686868] pointer-events-none"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, brands, and more..."
                  className="w-full h-[42px] bg-white rounded-sm pl-11 pr-5 text-sm text-black placeholder:text-[#666] outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>

            {/* Desktop Right Utilities */}
            <div className="ml-auto flex items-center justify-end gap-3 md:gap-6">
              <Link
                href="/track-my-order"
                className="hidden md:flex flex-col items-center justify-center min-w-[50px] group"
              >
                <Crosshair size={22} strokeWidth={1.8} />
                <span className="text-xs font-medium leading-tight">Track order</span>
              </Link>

              <Link
                href="#"
                className="hidden md:flex flex-col items-center justify-center min-w-[50px] group"
              >
                <Building2 size={22} strokeWidth={1.8} />
                <span className="text-xs font-medium leading-tight">Stores</span>
              </Link>

              <Link
                href="#"
                className="flex flex-col items-center justify-center min-w-[50px] group"
              >
                <User size={22} strokeWidth={1.8} />
                <span className="text-xs font-medium leading-tight">Log in</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="flex flex-col items-center justify-center min-w-[50px] group"
              >
                <ShoppingCart size={22} strokeWidth={1.8} />
                <span className="text-xs font-medium leading-tight">Cart</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Input */}
          <div className="pb-3 sm:hidden">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686868]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, and more..."
                className="w-full h-[40px] bg-white rounded-sm pl-11 pr-4 text-sm outline-none placeholder:text-[#666]"
              />
            </div>
          </div>
        </div>
      </header>

      {/* ================= DESKTOP CATEGORY BAR ================= */}
      <div ref={navRef} className="hidden lg:block bg-black text-white relative">
        <div className="mx-auto w-[95%]">
          <ul className="flex items-center flex-wrap">
            {categoryLinks.map((item) => {
              const isOpen = activeDropdown === item.name;
              return (
                <li key={item.name} className="relative">
                  <button
                    type="button"
                    onClick={() => item.hasDropdown && toggleDropdown(item.name)}
                    className={`
                      px-8 py-2 text-base font-bold whitespace-nowrap transition-colors flex items-center gap-5
                      ${isOpen
                        ? 'bg-jb-yellow text-black'
                        : 'text-white hover:bg-zinc-800'
                      }
                    `}
                  >
                    {item.name}
                  </button>

                  {/* Products Dropdown */}
                  {isOpen && item.name === 'Products' && (
                    <div className="absolute top-full left-0 w-[340px] bg-white text-black shadow-2xl border border-gray-200 z-50 overflow-hidden">
                      <div className="max-h-[480px] overflow-y-auto py-1 divide-y divide-gray-100">
                        {productSubmenu.map((subItem) => {
                          const IconComp = subItem.icon;
                          return (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              onClick={() => setActiveDropdown(null)}
                              className="flex items-center justify-between px-4 py-3 hover:bg-jb-yellow rounded-sm transition group"
                            >
                              <div className="flex items-center gap-3">
                                <IconComp
                                  size={20}
                                  className="text-black shrink-0"
                                />
                                <span className="font-semibold text-sm leading-snug">
                                  {subItem.name}
                                </span>
                              </div>
                              <ChevronRight
                                size={16}
                                className="text-gray-400 group-hover:text-black transition"
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Brands Dropdown */}
                  {isOpen && item.name === 'Brands' && (
                    <div className="absolute top-full left-0 w-[340px] bg-white text-black shadow-2xl z-50 py-2 border border-gray-100">
                      <div className="px-5 pb-3 border-b border-gray-200">
                        <Link
                          href="#"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-black hover:underline block"
                        >
                          All featured brands
                        </Link>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto py-2">
                        {brandsSubmenu.map((brand) => {
                          // Formats the brand name into a URL slug (e.g., "Fisher & Paykel" -> "fisher-and-paykel")
                          const brandSlug = brand
                            .toLowerCase()
                            .replace(/ & /g, '-and-')
                            .replace(/[^a-z0-0\s-]/g, '')
                            .trim()
                            .replace(/\s+/g, '-');

                          return (
                            <Link
                              key={brand}
                              href={`/${brandSlug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-5 py-2.5 text-base font-normal text-black hover:bg-jb-yellow transition-colors rounded-sm"
                            >
                              {brand}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ================= MOBILE DRAWER MENU ================= */}
      {isMobileMenuOpen && (
        <div className="w-full bg-white text-black border-t border-gray-200 shadow-xl lg:hidden">
          <div className="bg-black text-white text-center py-2.5 font-bold text-sm">
            Main menu
          </div>

          <nav className="divide-y divide-gray-100">
            <div className="py-2">
              {categoryLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition"
                >
                  <span className="font-bold text-base text-black">
                    {item.name}
                  </span>
                  {item.hasDropdown && (
                    <ChevronRight size={18} className="text-black" />
                  )}
                </Link>
              ))}
            </div>

            <div className="py-3 px-1 space-y-1">
              {secondaryLinks.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition"
                  >
                    <IconComponent size={20} className="text-black shrink-0" />
                    <span className="text-sm font-medium text-black">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}