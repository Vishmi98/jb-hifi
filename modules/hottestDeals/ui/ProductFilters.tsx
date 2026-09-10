'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronRight,
    SlidersHorizontal,
    ArrowUpDown,
    X,
    Plus,
    Minus,
    Check,
} from 'lucide-react';

import CustomSelect from '@/components/CustomSelect';


interface FilterState {
    category: string;
    brand: string;
    price: string;
    sortBy: string;
    itemsPerPage: string;
    excludeMarketplace: boolean;
}

const SORT_OPTIONS = [
    { label: 'Best Match', value: 'best-match' },
    { label: 'Price: Low to High', value: 'price-low' },
    { label: 'Price: High to Low', value: 'price-high' },
    { label: 'Customer Rating', value: 'rating' },
];

export default function ProductFilters() {
    const [filters, setFilters] = useState<FilterState>({
        category: '',
        brand: '',
        price: '',
        sortBy: 'best-match',
        itemsPerPage: '36',
        excludeMarketplace: false,
    });

    const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
    const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>('soldBy');
    const [mounted, setMounted] = useState(false);

    const [canScrollRight, setCanScrollRight] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const mobileSortRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close mobile sort dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (mobileSortRef.current && !mobileSortRef.current.contains(event.target as Node)) {
                setIsMobileSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent background body scroll when mobile drawer is active
    useEffect(() => {
        if (isMobileModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileModalOpen]);

    const handleScroll = (direction: 'left' | 'right') => {
        const el = scrollContainerRef.current;
        if (!el) return;
        el.scrollBy({
            left: direction === 'left' ? -300 : 300,
            behavior: 'smooth',
        });
    };

    const handleSelectChange = (key: keyof FilterState, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const toggleAccordion = (section: string) => {
        setOpenAccordion((prev) => (prev === section ? null : section));
    };

    const activeSortLabel = SORT_OPTIONS.find((opt) => opt.value === filters.sortBy)?.label || 'Best Match';

    return (
        <>
            {/* ---------------- MOBILE VIEW TRIGGER BAR (< md) ---------------- */}
            <div className="flex md:hidden items-center justify-between gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => setIsMobileModalOpen(true)}
                    className="flex-1 flex items-center justify-between border border-black px-4 py-2.5 bg-white text-sm font-bold text-black shadow-sm"
                >
                    <span>Filter</span>
                    <SlidersHorizontal size={18} />
                </button>

                {/* Mobile Sort Dropdown Button & Menu */}
                <div className="relative flex-1" ref={mobileSortRef}>
                    <button
                        type="button"
                        onClick={() => setIsMobileSortOpen((prev) => !prev)}
                        className="w-full flex items-center justify-between border border-black px-4 py-2.5 bg-white text-sm font-bold text-black shadow-sm"
                    >
                        <span className="truncate">{activeSortLabel}</span>
                        <ArrowUpDown size={18} className="shrink-0 ml-1" />
                    </button>

                    {isMobileSortOpen && (
                        <div className="absolute right-0 top-full mt-1 w-full bg-white border border-black shadow-lg z-50 py-1">
                            {SORT_OPTIONS.map((option) => {
                                const isSelected = filters.sortBy === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            handleSelectChange('sortBy', option.value);
                                            setIsMobileSortOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center justify-between hover:bg-gray-100 transition-colors ${isSelected ? 'bg-gray-50 text-black font-bold' : 'text-gray-700'
                                            }`}
                                    >
                                        <span>{option.label}</span>
                                        {isSelected && <Check size={14} className="text-black" />}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* ---------------- DESKTOP FILTER BAR (>= md) ---------------- */}
            <div className="hidden md:flex w-full flex-col xl:flex-row items-center justify-between gap-4 bg-gray-100 p-3 mb-6 border border-gray-200 text-xs sm:text-sm text-black">
                <div className="flex items-center gap-2 w-full xl:w-auto overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        className="flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth py-1"
                    >
                        <CustomSelect
                            label="Category"
                            value={filters.category}
                            onChange={(val) => handleSelectChange('category', val)}
                            options={[
                                { label: 'Cameras', value: 'cameras' },
                                { label: 'Drones', value: 'drones' },
                                { label: 'Accessories', value: 'accessories' },
                            ]}
                        />

                        <CustomSelect
                            label="Brand"
                            value={filters.brand}
                            onChange={(val) => handleSelectChange('brand', val)}
                            options={[
                                { label: 'DJI', value: 'dji' },
                                { label: 'Sony', value: 'sony' },
                                { label: 'GoPro', value: 'gopro' },
                                { label: 'Camp Snap', value: 'campsnap' },
                            ]}
                        />

                        <CustomSelect
                            label="Price"
                            value={filters.price}
                            onChange={(val) => handleSelectChange('price', val)}
                            options={[
                                { label: 'Under $500', value: 'under-500' },
                                { label: '$500 - $1000', value: '500-1000' },
                                { label: 'Over $1000', value: 'over-1000' },
                            ]}
                        />
                    </div>

                    {canScrollRight && (
                        <button
                            type="button"
                            onClick={() => handleScroll('right')}
                            className="p-1 shrink-0 hover:bg-gray-200 transition-colors"
                            aria-label="Scroll right"
                        >
                            <ChevronRight size={22} strokeWidth={3} />
                        </button>
                    )}
                </div>

                <div className="flex shrink-0 items-center gap-4 sm:gap-6 border-t xl:border-t-0 border-gray-300 pt-3 xl:pt-0 w-full xl:w-auto justify-between xl:justify-end">
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold">Show:</span>
                        {['36', '72', '100'].map((count) => (
                            <button
                                key={count}
                                type="button"
                                onClick={() => handleSelectChange('itemsPerPage', count)}
                                className={`px-1 font-bold ${filters.itemsPerPage === count
                                    ? 'underline text-black'
                                    : 'text-gray-600 hover:underline'
                                    }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-bold">Sort by:</span>
                        <CustomSelect
                            label="Sort by"
                            value={filters.sortBy}
                            onChange={(val) => handleSelectChange('sortBy', val)}
                            options={SORT_OPTIONS}
                        />
                    </div>
                </div>
            </div>

            {/* ---------------- MOBILE FILTER DRAWER MODAL ---------------- */}
            {isMobileModalOpen &&
                mounted &&
                createPortal(
                    <div className="fixed inset-0 z-[10000] flex justify-end bg-black/40">
                        <div className="w-full max-w-md bg-white h-full flex flex-col justify-between overflow-hidden text-black animate-in slide-in-from-right duration-200">
                            {/* Modal Header */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold">Filter</h2>
                                <button
                                    type="button"
                                    onClick={() => setIsMobileModalOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Scrollable Filter List Body */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                                {/* Accordion Sections */}
                                {[
                                    { title: 'Category', key: 'category' },
                                    { title: 'Brand', key: 'brand' },
                                ].map((sec) => (
                                    <div key={sec.key} className="border-b border-gray-100">
                                        <button
                                            type="button"
                                            onClick={() => toggleAccordion(sec.key)}
                                            className="w-full flex items-center justify-between py-3 px-1 font-semibold text-sm"
                                        >
                                            <span>{sec.title}</span>
                                            {openAccordion === sec.key ? (
                                                <Minus size={18} />
                                            ) : (
                                                <Plus size={18} />
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Sticky Modal Action Footer */}
                            <div className="p-4 border-t border-gray-100 bg-white">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileModalOpen(false)}
                                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 text-sm tracking-wide transition-colors"
                                >
                                    Show results
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}