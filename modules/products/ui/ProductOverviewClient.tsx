'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Breadcrumbs } from './Breadcrumbs';
import { ProductLeftSection } from './ProductLeftSection';
import { ProductRightSection } from './ProductRightSection';
import { ProductOverviewProps, ProductVariantDataType } from '../products.types';

import { slugifyProduct } from '@/utils/slug';
import { ProductAccordionSection } from './ProductAccordionSection';
import RecommendItems from './RecommendItems';
import RecentlyViewedItems from './RecentlyViewedItems';


// Helper to extract storage spec from a variant
const getStorageSpec = (v?: ProductVariantDataType | null) => {
    if (!v) return '';
    return (
        v.specifications?.find(
            (spec) =>
                spec.name.toLowerCase() === 'internal storage' ||
                spec.name.toLowerCase() === 'storage'
        )?.value || ''
    );
};

// Construct compound slug matching ProductCard layout: baseSlug-storageSlug-colorSlug
const buildVariantSlug = (baseSlug: string, variant: ProductVariantDataType | null) => {
    if (!variant) return baseSlug;
    const storageSlug = slugifyProduct(getStorageSpec(variant));
    const colorSlug = slugifyProduct(variant.color);

    return [baseSlug, storageSlug, colorSlug].filter(Boolean).join('-');
};

const ProductOverviewClient = ({
    product,
    initialVariant,
    currentSlug,
}: ProductOverviewProps) => {
    const router = useRouter();

    const {
        slug: baseSlug,
        images = [],
        mainImage,
        variants = [],
    } = product;

    // Active state managed by selected variant
    const [selectedVariant, setSelectedVariant] = useState<ProductVariantDataType | null>(
        initialVariant || variants[0] || null
    );

    // Track initialVariant prop to adjust state during render when prop changes
    const [prevInitialVariant, setPrevInitialVariant] = useState<ProductVariantDataType | null>(
        initialVariant || null
    );

    // Initial media setup
    const allGalleryImages = Array.from(
        new Set([
            mainImage,
            ...(images || []),
            ...variants.map((v) => v.imagePath).filter(Boolean),
        ])
    ).filter(Boolean) as string[];

    const [selectedImage, setSelectedImage] = useState<string>(
        selectedVariant?.imagePath || mainImage || allGalleryImages[0] || ''
    );

    // Sync state during render if initialVariant prop changes from SSR/URL updates
    if (initialVariant && initialVariant !== prevInitialVariant) {
        setPrevInitialVariant(initialVariant);
        setSelectedVariant(initialVariant);
        if (initialVariant.imagePath) {
            setSelectedImage(initialVariant.imagePath);
        }
    }

    // Direct variant selection & route replace handler
    const applyVariantSelection = (targetVariant: ProductVariantDataType) => {
        setSelectedVariant(targetVariant);
        if (targetVariant.imagePath) {
            setSelectedImage(targetVariant.imagePath);
        }

        const newSlug = buildVariantSlug(baseSlug, targetVariant);
        if (newSlug !== currentSlug) {
            router.replace(`/products/${newSlug}`, { scroll: false });
        }
    };

    // Helper: Find target variant when user switches Color
    const handleColorSelect = (targetColor: string) => {
        const currentStorageVal = getStorageSpec(selectedVariant).toLowerCase().trim();

        // 1. Try to find a variant matching both target Color AND current Storage
        const exactMatch = variants.find(
            (v) =>
                (v.color || '').toLowerCase().trim() === targetColor.toLowerCase().trim() &&
                getStorageSpec(v).toLowerCase().trim() === currentStorageVal
        );

        // 2. Fallback to first available variant with target Color
        const fallbackMatch = variants.find(
            (v) => (v.color || '').toLowerCase().trim() === targetColor.toLowerCase().trim()
        );

        const target = exactMatch || fallbackMatch;
        if (target) applyVariantSelection(target);
    };

    // Helper: Find target variant when user switches Storage
    const handleStorageSelect = (targetStorage: string) => {
        const currentColorVal = (selectedVariant?.color || '').toLowerCase().trim();

        // 1. Try to find a variant matching both target Storage AND current Color
        const exactMatch = variants.find(
            (v) =>
                getStorageSpec(v).toLowerCase().trim() === targetStorage.toLowerCase().trim() &&
                (v.color || '').toLowerCase().trim() === currentColorVal
        );

        // 2. Fallback to first available variant with target Storage
        const fallbackMatch = variants.find(
            (v) => getStorageSpec(v).toLowerCase().trim() === targetStorage.toLowerCase().trim()
        );

        const target = exactMatch || fallbackMatch;
        if (target) applyVariantSelection(target);
    };

    // Unique Color options (filters out empty/null color fields)
    const uniqueColorVariants = variants.reduce<ProductVariantDataType[]>((acc, v) => {
        if (!v.color || !v.color.trim()) return acc;
        const colorKey = v.color.toLowerCase().trim();
        if (!acc.some((item) => (item.color || '').toLowerCase().trim() === colorKey)) {
            acc.push(v);
        }
        return acc;
    }, []);

    // Unique Storage options (filters out empty/null storage specs)
    const uniqueStorageVariants = variants.reduce<ProductVariantDataType[]>((acc, v) => {
        const storageVal = getStorageSpec(v).toLowerCase().trim();
        if (!storageVal) return acc;
        if (!acc.some((item) => getStorageSpec(item).toLowerCase().trim() === storageVal)) {
            acc.push(v);
        }
        return acc;
    }, []);

    // Dynamic specs extraction
    const currentStorage = getStorageSpec(selectedVariant);
    const currentColor = selectedVariant?.color || '';

    return (
        <>
            <div className="min-h-screen w-[95%] md:w-[90%] mx-auto text-black font-sans pb-16">
                {/* Breadcrumb Navigation */}
                <Breadcrumbs
                    product={product}
                    currentStorage={currentStorage}
                    currentColor={currentColor}
                />

                {/* Product Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* LEFT SECTION: Gallery Thumbnails & Main Preview Image */}
                    <ProductLeftSection
                        product={product}
                        selectedImage={selectedImage}
                        setSelectedImage={setSelectedImage}
                        currentColor={currentColor}
                        selectedVariant={selectedVariant}
                        currentStorage={currentStorage}
                        uniqueColorVariants={uniqueColorVariants}
                        uniqueStorageVariants={uniqueStorageVariants}
                        handleColorSelect={handleColorSelect}
                        handleStorageSelect={handleStorageSelect}
                    />

                    {/* RIGHT SECTION Component */}
                    <ProductRightSection
                        product={product}
                        selectedVariant={selectedVariant}
                        currentColor={currentColor}
                        currentStorage={currentStorage}
                        uniqueColorVariants={uniqueColorVariants}
                        uniqueStorageVariants={uniqueStorageVariants}
                        handleColorSelect={handleColorSelect}
                        handleStorageSelect={handleStorageSelect}
                    />
                </div>
            </div>
            {/* Accordion Component */}
            <ProductAccordionSection
                product={product}
                selectedVariant={selectedVariant}
            />
            <RecommendItems />
            <RecentlyViewedItems />
        </>
    );
};

export default ProductOverviewClient;