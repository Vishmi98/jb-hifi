'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

import { getStores } from '@/modules/store/store.service';
import { StoreDataType } from '@/modules/store/store.types';
import { slugify } from '@/utils/slug';


export default function MarketplaceSellers() {
    const [stores, setStores] = useState<StoreDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isMounted = true;

        const fetchAllStores = async () => {
            setIsLoading(true);
            try {
                // Fetch with a large limit to grab all sellers for alphabetical display
                const res = await getStores(1, 500);
                if (isMounted && res.success && res.stores) {
                    setStores(res.stores);
                }
            } catch (error) {
                console.error('Failed to fetch marketplace sellers:', error);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        void fetchAllStores();

        return () => {
            isMounted = false;
        };
    }, []);

    // Group stores by their first letter (A-Z) sorted alphabetically
    const groupedStores = useMemo(() => {
        const sorted = [...stores].sort((a, b) => a.name.localeCompare(b.name));

        return sorted.reduce<Record<string, StoreDataType[]>>((acc, store) => {
            const firstChar = store.name.charAt(0).toUpperCase();
            const letterKey = /[A-Z]/.test(firstChar) ? firstChar : '#';

            if (!acc[letterKey]) {
                acc[letterKey] = [];
            }
            acc[letterKey].push(store);
            return acc;
        }, {});
    }, [stores]);

    const letterKeys = useMemo(() => Object.keys(groupedStores).sort(), [groupedStores]);

    if (isLoading) {
        return (
            <div className="w-full py-12 flex flex-col gap-6 animate-pulse">
                <div className="h-8 w-64 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-6 w-8 bg-gray-200 rounded" />
                            <div className="h-4 w-32 bg-gray-200 rounded" />
                            <div className="h-4 w-40 bg-gray-200 rounded" />
                            <div className="h-4 w-28 bg-gray-200 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!stores.length) return null;

    return (
        <section className="w-full pt-8 pb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-8 tracking-tight">
                All marketplace sellers
            </h2>

            {/* Multi-column Grid Layout (matches JB Hi-Fi seller directory) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-6 items-start text-xs sm:text-sm">
                {letterKeys.map((letter) => (
                    <div key={letter} className="flex flex-col">
                        <span className="font-extrabold text-lg md:text-xl text-black pb-0.5 mb-1">
                            {letter}
                        </span>
                        {groupedStores[letter]
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((seller) => {
                                const sellerHref = `/marketplace/${seller.slug || slugify(seller.name)}`;
                                return (
                                    <Link
                                        key={seller.id || seller.id}
                                        href={sellerHref}
                                        className="text-gray-800 hover:text-black underline transition-colors w-fit line-clamp-1 text-lg"
                                    >
                                        {seller.name}
                                    </Link>
                                );
                            })}
                    </div>
                ))}
            </div>
        </section>
    );
}