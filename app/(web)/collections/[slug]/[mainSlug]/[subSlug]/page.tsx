import { notFound } from 'next/navigation';

import { fetchSubCategory } from '@/lib/fetchData';
import SubCategoryOverview from '@/modules/subCategory/ui/SubCategoryOverview';


export default async function SubCategoryPage({ params }: { params: Promise<{ subSlug: string }> }) {
    const { subSlug } = await params;

    if (!subSlug) {
        console.log("Category is missing from subSlug params");
        return notFound();
    }

    const subCategoryData = await fetchSubCategory(subSlug);

    if (!subCategoryData) {
        return notFound();
    }

    return (
        <SubCategoryOverview subCategory={subCategoryData} />
    );
}