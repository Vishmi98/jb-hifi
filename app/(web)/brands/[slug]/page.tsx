import { notFound } from 'next/navigation';

import { fetchBrand } from '@/lib/fetchData';
import BrandOverview from '@/modules/brand/ui/BrandOverview';


export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!slug) {
        console.log("Brand is missing from slug params");
        return notFound();
    }

    const brandData = await fetchBrand(slug);

    if (!brandData) {
        return notFound();
    }
    return (
        <BrandOverview brand={brandData} />
    );
}