import { notFound } from 'next/navigation';

import { fetchCategory } from '@/lib/fetchData';
import CategoryOverview from '@/modules/category/ui/CategoryOverview';


export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    if (!slug) {
        console.log("Category is missing from slug params");
        return notFound();
    }

    const categoryData = await fetchCategory(slug);

    if (!categoryData) {
        return notFound();
    }

    return (
        <CategoryOverview category={categoryData} />
    );
}