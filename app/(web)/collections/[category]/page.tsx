// app/collections/[category]/page.tsx
import Link from 'next/link';

import HeroCarousel from '@/modules/collections/ui/HeroCarousel';
import CategoryCarousel from '@/modules/collections/ui/CategoryCarousel';
import { COLLECTION_PRODUCTS, FEATURED_PRODUCTS } from '@/constants/data';
import ProductCard from '@/modules/homePage/ui/ProductCard';
import ProductFilters from '@/modules/collections/ui/ProductFilters';


function formatCategoryTitle(slug: string): string {
    return slug
        .split('-')
        .map((word) => (word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1)))
        .join(' ');
}

export default async function CollectionPage({
    params,
}: {
    params: Promise<{ category: string }>;
}) {
    const resolvedParams = await params;
    const categoryTitle = formatCategoryTitle(resolvedParams.category);

    return (
        <div className="min-h-screen w-[95%] md:w-[85%] mx-auto text-black">
            {/* Breadcrumb Navigation */}
            <div className="my-10">
                <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                    <Link href="/" className="hover:underline">Home</Link>
                    <span>/</span>
                    <span className="font-semibold text-gray-600">{categoryTitle}</span>
                </div>
            </div>

            <HeroCarousel />

            {/* Header Description */}
            <div className="mt-8 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                    {categoryTitle}
                </h1>
                <p className="text-gray-700 text-sm sm:text-base max-w-4xl leading-relaxed">
                    Document your adventures in style with JB&apos;s cameras and drone collection! Choose from DJI drones for epic aerial shots, GoPro for action scenes, and top-tier mirrorless and compact cameras from Sony, Fujifilm, Canon, and more.
                </p>
            </div>

            <CategoryCarousel />

            {/* Featured Products Section */}
            <section className="my-12">
                <h2 className="sub-titles text-xl md:text-2xl font-bold">
                    Featured
                </h2>

                {/* Flex container with explicit items-stretch for uniform height */}
                <div
                    className="flex gap-4 overflow-x-auto scrollbar-none scroll-smooth pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {FEATURED_PRODUCTS.map((prod) => (
                        <ProductCard
                            key={prod.id}
                            prod={prod}
                        />
                    ))}
                </div>

            </section>


            <section className="my-8">
                {/* Filters & Sorting Toolbar */}
                <ProductFilters />

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
                    {COLLECTION_PRODUCTS.map((product) => (
                        <div key={product.id} className="w-full flex justify-center">
                            <ProductCard prod={product} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}