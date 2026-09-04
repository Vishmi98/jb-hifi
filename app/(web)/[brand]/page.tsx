import Link from 'next/link';
import Image from 'next/image';

import HeroCarousel from '@/modules/collections/ui/HeroCarousel';


interface BrandPageProps {
    params: Promise<{
        brand: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function unslugify(slug: string): string {
    return slug
        .replace(/-and-/g, ' & ')
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Convert title strings to URL-friendly slugs (e.g. "Mac Laptops" -> "mac-laptops")
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9 -]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

export async function generateMetadata({ params }: BrandPageProps) {
    const { brand } = await params;
    const brandName = unslugify(brand);

    return {
        title: `${brandName} Products & Deals | JB Hi-Fi Style`,
        description: `Shop the latest ${brandName} products, deals, and tech online with fast shipping.`,
    };
}

const categories = [
    {
        title: 'iPhone',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/files/iphone.jpg?v=1757658681',
        compareText: 'Compare iPhone models >',
        compareLink: '/compare/iphone',
        category: "Mobile Phones"
    },
    {
        title: 'Apple Watch',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/files/jb-au-20240910-apple-brand-page-watch-tile_cbf3213a-730c-4026-b980-5ed3b800c298.jpg?v=1726026196',
        compareText: 'Compare Apple Watch models >',
        compareLink: '/compare/apple-watch',
        category: "Health Fitness Wearables"
    },
    {
        title: 'Mac Laptops',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/files/jb-au-20240508-apple-brand-page-update-mac-laptops.jpg?v=1715215845',
        compareText: 'Compare Mac Laptop models >',
        compareLink: '/compare/mac-laptops',
        category: "Computers Tablets"
    },
    {
        title: 'iPad',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/files/jb-au-20240508-apple-brand-page-update-ipad.jpg?v=1715212743',
        compareText: 'Compare iPad models >',
        compareLink: '/compare/ipad',
        category: "Computers Tablets"
    },
    {
        title: 'Mac Desktops',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/t/16/assets/jbau20230113macdesktops_tile_700x248-1673313123630.png?v=1673313124',
        compareText: 'Compare Mac Desktop models >',
        compareLink: '/compare/mac-desktops',
        category: "Computers Tablets"
    },
    {
        title: 'AirPods',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/files/jb-au-20240910-apple-brand-page-airpods-tile.jpg?v=1726026036',
        compareText: 'Compare AirPods models >',
        compareLink: '/compare/airpods',
        category: "Headphones Speakers Audio"
    },
    {
        title: 'Apple TV',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/t/16/assets/jbau20230113appletv_tile_700x248-1673312096877.png?v=1673312097',
        compareText: '',
        compareLink: '',
        category: "Tvs"
    },
    {
        title: 'Beats',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/t/16/assets/jbau20230113beats_tile_700x248-1673820475077.png?v=1673820475',
        compareText: '',
        compareLink: '',
        category: "Headphones Speakers Audio"
    },
    {
        title: 'Accessories',
        image: 'https://cdn.shopify.com/s/files/1/0024/9803/5810/t/16/assets/jbau20230113accessories_tile_700x248-1673312125374.png?v=1673312126',
        compareText: '',
        compareLink: '',
        category: "Computers Tablets"
    },
];

export default async function BrandPage({ params }: BrandPageProps) {
    const { brand } = await params;

    return (
        <div className="min-h-screen w-[95%] md:w-[85%] mx-auto text-black my-10">
            <HeroCarousel />

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-10">
                {categories.map((item, index) => {
                    const categorySlug = slugify(item.category);
                    const subCategorySlug = slugify(item.title);

                    const itemHref = `/collections/${categorySlug}/${subCategorySlug}`;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            {/* Image Box Link */}
                            <Link
                                href={itemHref}
                                className="relative w-full h-[200px] overflow-hidden bg-white hover:border-gray-400 transition"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain p-4"
                                />
                            </Link>

                            {/* Compare Link below card */}
                            {item.compareText && (
                                <Link
                                    href={item.compareLink}
                                    className="mt-3 text-sm font-medium text-black underline hover:text-gray-700"
                                >
                                    {item.compareText}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}