'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
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
  Loader2,
  ChevronLeft,
} from 'lucide-react';

import CartDrawer from './CartDrawer';

import { CategoryDataType } from '@/modules/category/category.types';
import { MainCategoryDataType } from '@/modules/mainCategory/mainCategory.types';
import { SubCategoryDataType } from '@/modules/subCategory/subCategory.types';
import { getCategories } from '@/modules/category/category.service';
import { getMainCategoryByCategory } from '@/modules/mainCategory/mainCategory.service';
import { getSubCategoryByMainCategory } from '@/modules/subCategory/subCategory.service';
import { BrandDataType } from '@/modules/brand/brand.types';
import { getBrands } from '@/modules/brand/brand.service';
import { subscribeToDataChanges } from '@/lib/realtimeClient';


const categoryLinks = [
  { name: 'New', href: '/blogs/new-at-jb', hasDropdown: false },
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

  // Mobile Drill-Down Navigation State
  // 0 = Main Menu, 1 = Products, 2 = Main Categories, 3 = Sub Categories, 4 = Brands List
  const [mobileLevel, setMobileLevel] = useState<number>(0);

  // Category & Brand States
  const [categories, setCategories] = useState<CategoryDataType[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategoryDataType[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategoryDataType[]>([]);
  const [brands, setBrands] = useState<BrandDataType[]>([]);

  // Selection Tracking
  const [selectedCategory, setSelectedCategory] = useState<CategoryDataType | null>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategoryDataType | null>(null);

  // Loading States
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingMainCategories, setLoadingMainCategories] = useState(false);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);

  // Category Handlers
  async function handleCategoryClick(category: CategoryDataType) {
    if (selectedCategory?.id === category.id) {
      setMobileLevel(2);
      return;
    }

    setSelectedCategory(category);
    setSelectedMainCategory(null);
    setMainCategories([]);
    setSubCategories([]);

    setLoadingMainCategories(true);
    setMobileLevel(2);

    try {
      const res = await getMainCategoryByCategory({ categoryId: Number(category.id) });
      if (res.success && res.mainCategories) {
        setMainCategories(res.mainCategories);
      }
    } catch (err) {
      console.error('Failed to fetch main categories:', err);
    } finally {
      setLoadingMainCategories(false);
    }
  }

  async function handleMainCategoryClick(mainCat: MainCategoryDataType) {
    if (selectedMainCategory?.id === mainCat.id) {
      setMobileLevel(3);
      return;
    }

    setSelectedMainCategory(mainCat);
    setSubCategories([]);

    setLoadingSubCategories(true);
    setMobileLevel(3);

    try {
      const res = await getSubCategoryByMainCategory({ mainCategoryId: Number(mainCat.id) });
      if (res.success && res.subCategories) {
        setSubCategories(res.subCategories);
      }
    } catch (err) {
      console.error('Failed to fetch sub categories:', err);
    } finally {
      setLoadingSubCategories(false);
    }
  }

  // Fetch Brands handler
  const fetchBrandsList = useCallback(async (force = false, showLoading = true) => {
    if (!force && brands.length > 0) return;
    if (showLoading) {
      setLoadingBrands(true);
    }
    try {
      const res = await getBrands();
      if (res.success && res.brands) {
        setBrands(res.brands);
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    } finally {
      if (showLoading) {
        setLoadingBrands(false);
      }
    }
  }, [brands.length]);

  // Open Brands in Mobile Navigation
  const handleBrandsMobileClick = () => {
    setMobileLevel(4);
    fetchBrandsList();
  };

  // Mobile Back Navigation Logic
  const handleMobileBack = () => {
    if (mobileLevel === 4) {
      setMobileLevel(0);
    } else if (mobileLevel === 3) {
      setMobileLevel(2);
      setSelectedMainCategory(null);
      setSubCategories([]);
    } else if (mobileLevel === 2) {
      setMobileLevel(1);
      setSelectedCategory(null);
      setMainCategories([]);
    } else if (mobileLevel === 1) {
      setMobileLevel(0);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setMobileLevel(0);
    setSelectedCategory(null);
    setSelectedMainCategory(null);
  };

  const fetchCategoriesList = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoadingCategories(true);
    }

    try {
      const res = await getCategories();
      if (res.success && res.categories) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      if (showLoading) {
        setLoadingCategories(false);
      }
    }
  }, []);

  useEffect(() => {
    const initialFetchId = window.setTimeout(() => {
      void fetchCategoriesList();
    }, 0);
    const unsubscribeCategories = subscribeToDataChanges('categories', () => {
      void fetchCategoriesList(false);
    });
    const unsubscribeBrands = subscribeToDataChanges('brands', () => {
      void fetchBrandsList(true, false);
    });

    return () => {
      window.clearTimeout(initialFetchId);
      unsubscribeCategories();
      unsubscribeBrands();
    };
  }, [fetchBrandsList, fetchCategoriesList]);

  const navRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (name: string) => {
    const nextState = activeDropdown === name ? null : name;
    setActiveDropdown(nextState);

    if (nextState === 'Brands') {
      fetchBrandsList();
    }
  };

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
        <div className="mx-auto w-[95%] md:w-[90%]">
          <div className="h-[70px] flex items-center justify-between gap-6 lg:gap-10 w-full">
            <button
              type="button"
              onClick={() => {
                if (isMobileMenuOpen) {
                  closeMobileMenu();
                } else {
                  setIsMobileMenuOpen(true);
                }
              }}
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

            <Link onClick={closeMobileMenu} href="/" className="shrink-0 flex flex-col items-center justify-center">
              <Image src="/logo1.png" alt="logo" width={155} height={155} />
              <span className="jb-callout-logo text-[12px] sm:text-[14px] font-medium leading-tight">
                ALWAYS CHEAP PRICES
              </span>
            </Link>

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

            <div className="ml-auto flex items-center justify-end gap-3 md:gap-6">
              <Link href="/track-my-order" className="hidden md:flex flex-col items-center justify-center min-w-[50px] group">
                <Crosshair size={22} strokeWidth={1.8} />
                <span className="text-xs font-medium leading-tight">Track order</span>
              </Link>

              <Link href="#" className="hidden md:flex flex-col items-center justify-center min-w-[50px] group">
                <Building2 size={22} strokeWidth={1.8} />
                <span className="text-xs font-medium leading-tight">Stores</span>
              </Link>

              <Link href="#" className="flex flex-col items-center justify-center min-w-[50px] group">
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

          <div className="pb-3 sm:hidden">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#686868]" />
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
              const linkClasses = `px-8 py-2 text-base font-bold whitespace-nowrap transition-colors flex items-center gap-5 ${isOpen ? 'bg-jb-yellow text-black' : 'text-white hover:text-black hover:bg-jb-yellow'
                }`;

              return (
                <li key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <button
                      type="button"
                      onClick={() => toggleDropdown(item.name)}
                      className={linkClasses}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setActiveDropdown(null)}
                      className={linkClasses}
                    >
                      {item.name}
                    </Link>
                  )}

                  {/* Desktop Dropdown: Products */}
                  {isOpen && item.name === 'Products' && (
                    <div
                      className={`absolute top-full left-0 bg-white text-black shadow-2xl border border-gray-200 z-50 flex h-[460px] transition-all duration-200 ${selectedMainCategory ? 'w-[900px]' : selectedCategory ? 'w-[600px]' : 'w-[300px]'
                        }`}
                    >
                      <div className="w-[300px] shrink-0 border-r border-gray-200 overflow-y-auto py-1 bg-gray-50">
                        {loadingCategories ? (
                          <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-gray-500" size={24} />
                          </div>
                        ) : (
                          categories.map((cat) => (
                            <button
                              type="button"
                              key={cat.id}
                              onClick={() => handleCategoryClick(cat)}
                              className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold transition-colors ${selectedCategory?.id === cat.id ? 'bg-jb-yellow text-black' : 'hover:bg-gray-100'
                                }`}
                            >
                              <span>{cat.name}</span>
                              <ChevronRight size={16} className="text-gray-500" />
                            </button>
                          ))
                        )}
                      </div>

                      {selectedCategory && (
                        <div className="w-[300px] shrink-0 border-r border-gray-200 overflow-y-auto py-1 bg-white">
                          {loadingMainCategories ? (
                            <div className="flex justify-center items-center h-full">
                              <Loader2 className="animate-spin text-gray-500" size={24} />
                            </div>
                          ) : mainCategories.length === 0 ? (
                            <div className="p-4 text-xs text-gray-400 text-center mt-10">No items available</div>
                          ) : (
                            mainCategories.map((mainCat) => (
                              <button
                                type="button"
                                key={mainCat.id}
                                onClick={() => handleMainCategoryClick(mainCat)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${selectedMainCategory?.id === mainCat.id ? 'bg-jb-yellow text-black font-semibold' : 'hover:bg-gray-100'
                                  }`}
                              >
                                <span>{mainCat.name}</span>
                                <ChevronRight size={16} className="text-gray-400" />
                              </button>
                            ))
                          )}
                        </div>
                      )}

                      {selectedCategory && selectedMainCategory && (
                        <div className="w-[300px] shrink-0 overflow-y-auto py-1 bg-white">
                          {loadingSubCategories ? (
                            <div className="flex justify-center items-center h-full">
                              <Loader2 className="animate-spin text-gray-500" size={24} />
                            </div>
                          ) : subCategories.length === 0 ? (
                            <div className="p-4 text-xs text-gray-400 text-center mt-10">No sub-items available</div>
                          ) : (
                            subCategories.map((subCat) => (
                              <Link
                                key={subCat.id}
                                href={`/collections/${subCat.categoryInfo?.slug}/${subCat.mainCategoryInfo?.mainSlug}/${subCat.subSlug}`}
                                onClick={() => setActiveDropdown(null)}
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-jb-yellow hover:text-black transition-colors"
                              >
                                {subCat.name}
                              </Link>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Desktop Dropdown: Brands */}
                  {isOpen && item.name === 'Brands' && (
                    <div className="absolute top-full left-0 w-[340px] bg-white text-black shadow-2xl z-50 py-2 border border-gray-100">
                      <div className="px-5 pb-3 border-b border-gray-200">
                        <Link
                          href="/brands"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-black hover:underline block"
                        >
                          All featured brands
                        </Link>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto py-2">
                        {loadingBrands ? (
                          <div className="flex justify-center items-center h-full">
                            <Loader2 className="animate-spin text-gray-500" size={24} />
                          </div>
                        ) : brands.length === 0 ? (
                          <div className="p-4 text-xs text-gray-400 text-center mt-10">No brands available</div>
                        ) : (
                          brands.map((brand) => (
                            <Link
                              key={brand.id}
                              href={`/brands/${brand.slug}`}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-4 py-2.5 text-sm text-gray-800 hover:bg-jb-yellow hover:text-black font-medium transition-colors"
                            >
                              {brand.name}
                            </Link>
                          ))
                        )}
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
          {/* Header Bar with Back Button */}
          <div className="bg-black text-white px-4 py-2.5 font-bold text-sm flex items-center justify-between">
            {mobileLevel > 0 ? (
              <button
                type="button"
                onClick={handleMobileBack}
                className="flex items-center gap-1 text-jb-yellow hover:underline"
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}
            <span className="truncate max-w-[200px]">
              {mobileLevel === 0 && 'Main Menu'}
              {mobileLevel === 1 && 'Products'}
              {mobileLevel === 2 && selectedCategory?.name}
              {mobileLevel === 3 && selectedMainCategory?.name}
              {mobileLevel === 4 && 'Brands'}
            </span>
            <div className="w-12" />
          </div>

          <nav className="divide-y divide-gray-100">
            {/* LEVEL 0: Main Menu */}
            {mobileLevel === 0 && (
              <>
                <div className="py-2">
                  {categoryLinks.map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        if (item.name === 'Products') {
                          setMobileLevel(1);
                        } else if (item.name === 'Brands') {
                          handleBrandsMobileClick();
                        }
                      }}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition text-left"
                    >
                      <span className="font-bold text-base text-black">{item.name}</span>
                      {item.hasDropdown && <ChevronRight size={18} className="text-black" />}
                    </button>
                  ))}
                </div>

                <div className="py-3 px-1 space-y-1">
                  {secondaryLinks.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3.5 px-4 py-2.5 hover:bg-gray-50 transition"
                      >
                        <IconComponent size={20} className="text-black shrink-0" />
                        <span className="text-sm font-medium text-black">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}

            {/* LEVEL 1: Primary Categories */}
            {mobileLevel === 1 && (
              <div className="py-2">
                {loadingCategories ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                  </div>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 text-left border-b border-gray-50"
                    >
                      <span className="font-semibold text-sm text-black">{cat.name}</span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            )}

            {/* LEVEL 2: Main Categories */}
            {mobileLevel === 2 && (
              <div className="py-2">
                {loadingMainCategories ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                  </div>
                ) : mainCategories.length === 0 ? (
                  <div className="p-6 text-xs text-gray-400 text-center">No categories available</div>
                ) : (
                  mainCategories.map((mainCat) => (
                    <button
                      key={mainCat.id}
                      type="button"
                      onClick={() => handleMainCategoryClick(mainCat)}
                      className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 text-left border-b border-gray-50"
                    >
                      <span className="text-sm font-medium text-black">{mainCat.name}</span>
                      <ChevronRight size={18} className="text-gray-400" />
                    </button>
                  ))
                )}
              </div>
            )}

            {/* LEVEL 3: Sub Categories */}
            {mobileLevel === 3 && (
              <div className="py-2">
                {loadingSubCategories ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                  </div>
                ) : subCategories.length === 0 ? (
                  <div className="p-6 text-xs text-gray-400 text-center">No sub-items available</div>
                ) : (
                  subCategories.map((subCat) => (
                    <Link
                      key={subCat.id}
                      href={`/collections/${subCat.categoryInfo?.slug}/${subCat.mainCategoryInfo?.mainSlug}/${subCat.subSlug}`}
                      onClick={closeMobileMenu}
                      className="block px-5 py-3 text-sm text-gray-800 hover:bg-jb-yellow transition-colors border-b border-gray-50"
                    >
                      {subCat.name}
                    </Link>
                  ))
                )}
              </div>
            )}

            {/* LEVEL 4: Mobile Brands View */}
            {mobileLevel === 4 && (
              <div className="py-2">
                {loadingBrands ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 className="animate-spin text-gray-500" size={24} />
                  </div>
                ) : brands.length === 0 ? (
                  <div className="p-6 text-xs text-gray-400 text-center">No brands available</div>
                ) : (
                  brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.slug}`}
                      onClick={closeMobileMenu}
                      className="block px-5 py-3 text-sm text-gray-800 hover:bg-jb-yellow transition-colors border-b border-gray-50"
                    >
                      {brand.name}
                    </Link>
                  ))
                )}
              </div>
            )}
          </nav>
        </div>
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}