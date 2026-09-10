import { notFound } from 'next/navigation';

import { fetchMainCategory } from '@/lib/fetchData';
import MainCategoryOverview from '@/modules/mainCategory/ui/MainCategoryOverview';


export default async function MainCategoryPage({ params }: { params: Promise<{ mainSlug: string }> }) {
    const { mainSlug } = await params;

    if (!mainSlug) {
        console.log("Category is missing from mainSlug params");
        return notFound();
    }

    const mainCategoryData = await fetchMainCategory(mainSlug);

    if (!mainCategoryData) {
        return notFound();
    }

    return (
        <MainCategoryOverview mainCategory={mainCategoryData} />
    );
}