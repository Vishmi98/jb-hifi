import { notFound } from 'next/navigation';

import { fetchLeafCategory } from '@/lib/fetchData';
import LeafCategoryOverview from '@/modules/leafCategory/ui/LeafCategoryOverview';


export default async function LeafCategoryPage({ params }: { params: Promise<{ leafSlug: string }> }) {
    const { leafSlug } = await params;

    if (!leafSlug) {
        console.log("Category is missing from leafSlug params");
        return notFound();
    }

    const leafCategoryData = await fetchLeafCategory(leafSlug);

    if (!leafCategoryData) {
        return notFound();
    }

    return (
        <LeafCategoryOverview leafCategory={leafCategoryData} />
    );
}